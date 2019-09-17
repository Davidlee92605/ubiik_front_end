import {Component, Inject, LOCALE_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-redirect',
  template: '<p>Redirecting to <a href="{{url}}">{{url}}</a></p>'
})
export class RedirectComponent {

  url = '';
  defaultLang = 'en';

  languageList = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'fr', label: 'Française' },
    { code: 'ja', label: '日本語' },
  ];

  constructor(@Inject(LOCALE_ID) protected localeId: string,
              private route: ActivatedRoute) {

    let lang = localStorage.getItem('lang') || this.defaultLang;
    {
      const found = this.languageList.find(ll => ll.code === lang);
      if (!found) {
        localStorage.removeItem('lang');
        lang = this.defaultLang;
      }
    }

    let url = null;
    const segments = this.route.snapshot.url.map(s => s.path);
    if (segments.length > 0) {
      // if first segment is a valid lang, change it to the selected lang
      const found = this.languageList.find(ll => ll.code === segments[0]);
      if (found) {
        segments[0] = lang;
      }
      // join it up
      url = segments.join('/');
      // process any query
      const params = this.route.snapshot.queryParams;
      if (Object.keys(params).length > 0) {
        const q: string[] = [];
        Object.keys(params).forEach(k => q.push(k + '=' + params[k]));
        url = url + '?' + q.join('&');
      }
    }

    this.url = lang + (url ? '/' + url : '');
    console.log('redirecting to', this.url);

    window.location.assign(this.url);
  }
}
