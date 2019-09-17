import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangState {

  selectedLang = 'en';

  languageList = [
    {code: 'en', label: 'English'},
    {code: 'zh', label: '中文'},
    {code: 'fr', label: 'Française'},
    {code: 'ja', label: '日本語'},
  ];

  // state events
  public langChangedEvent$ = new Subject<string>();

  // various states
  public currentLang$ = new BehaviorSubject<string>('en');
  public languages$ = new BehaviorSubject<{code: string, label: string}[]>(this.languageList);

  constructor(
    @Inject(LOCALE_ID) protected localeId: string,
  ) {
    this.langChangedEvent$.subscribe(l => LangState.onLangChanged(l));
  }

  private static onLangChanged(lang: string) {
    localStorage.setItem('lang', lang);
    window.location.assign('/' + lang);
  }

  getSelectedLang() {
    const lng = this.languageList.find(l => l.code === this.selectedLang);
    if (lng) {
      return lng.label;
    } else {
      return 'English';
    }
  }
}
