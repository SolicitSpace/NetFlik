import { Subject, Subscription } from 'rxjs';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isSearchInputActive: boolean = false;
  searchInputVal: string = '';
  @Output() searchInput = new EventEmitter<string>();
  @Output() refreshResultsEvt = new EventEmitter<null>();
  @ViewChild('searchInputField')
  searchInputField!: ElementRef<HTMLInputElement>;
  isShowBgMenu: boolean = false;
  searchBy!: string;

  // Mic variables ---
  isMicActive: boolean = false;
  micSearchInputObs: Subject<string> = new Subject<string>();
  micSearchInputObsSub!: Subscription;

  constructor(
    public voiceRecognitionService: VoiceRecognitionService,
    private global: GlobalService
  ) {
    this.voiceRecognitionService.init();
  }

  onSearchInput(evt: any) {
    this.searchInput.emit(evt);
  }

  onSearchActive(searchBy: string) {
    console.log('2 this.searchBy : ', searchBy);

    this.isSearchInputActive = true;
    this.searchBy = searchBy;
    // need to add focus since the element is only rendered
    // immediately after setting `isSearchInputActive` as true
    setTimeout(() => {
      if (this.searchInputField) this.searchInputField.nativeElement.focus();
    }, 250);
  }
  onSearchInactive(e: Event) {
    // console.log(e);

    if (this.searchInputVal.trim().length == 0) {
      this.isSearchInputActive = false;
      this.stopMicListen();
    }
    // this.isSearching = true;
    this.searchInput.emit(this.searchInputVal);
  }

  onMicListen() {
    if (!this.isMicActive) {
      this.startMicListen();
    } else if (this.isMicActive) {
      this.stopMicListen();
    }
  }

  startMicListen() {
    this.isMicActive = true;
    this.voiceRecognitionService.start(this.micSearchInputObs);
    this.micSearchInputObsSub = this.micSearchInputObs.subscribe(
      (str: string) => {
        this.searchInputVal = str;
        this.onSearchInput(str); // searching for the entered term
        this.onMicListen(); // turning the mic off
      }
    );
  }
  stopMicListen() {
    if (!this.isMicActive) return; // only stopping the mic if it is active
    this.isMicActive = false;
    this.micSearchInputObsSub.unsubscribe(); // unsubbing from the subscribe event
    this.voiceRecognitionService.stop(); // stopping the voice recog module
  }

  isHideMicIcon: boolean = false;
  manageMicIconVis() {
    if (this.searchBy == 'typing') this.isHideMicIcon = !this.isHideMicIcon;
  }

  navToHomePage() {
    window.location.reload();
  }

  manageBgMenuVis() {
    this.isShowBgMenu = !this.isShowBgMenu;
  }

  // Easter Egg module (Turned Off by default)
  // Only allow reveal all when user clicks n time on the icon
  easterEggActive: boolean = false; // set this to true to activate
  revealBtnCounter: number = 0;
  revealBtnCounterLimit: number = 10; // number of clicks to turn on and just one to turn off
  revealAllContent(accountImgElm: any) {
    if (!this.easterEggActive) return;
    if (accountImgElm.style.filter == 'invert(1)') window.location.reload();
    this.revealBtnCounter++;
    if (this.revealBtnCounter <= this.revealBtnCounterLimit) return;
    this.revealBtnCounter = 0;
    accountImgElm.style.filter = 'invert(1)';
    this.global.isRevealAll = true;
    this.refreshResultsEvt.emit();
  }
}
