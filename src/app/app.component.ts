import { Component, VERSION, ViewChild } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  isCardNumMasked = false;
  // this `cardNumber` is used for final result for example when form submit
  cardNumber = '';
  @ViewChild('maskNum') maskNum;

  setIsCardNumMasked(isMasked: boolean) {
    this.isCardNumMasked = isMasked;
  }

  formatCardNumber(value, cardType) {
    if (cardType === 'AMEX') {
      return value.replace(/(\d{4})/, '$1 ').replace(/(\s\d{6})/, '$1 ');
    }

    if (cardType === 'HD_PROX') {
      return value
        .replace(/(\d{4})/g, '$1 ')
        .replace(/(\d{4}\s\d{4}\s\d{4}\s\d{4}\s\d{4})(\s)/, '$1');
    }

    return value
      .replace(/(\d{4})/g, '$1 ')
      .replace(/(\d{4}\s\d{4}\s\d{4}\s\d{4})(\s)/, '$1');
  }

  maskCardNumber(value, cardType) {
    var formattedValue = this.formatCardNumber(value, cardType);

    if (cardType === 'HD_PROX' && value.length >= 16) {
      var _masked = formattedValue
        .replace(/^([\d|\s]{0,15})([\d|\s]*?)$/, '$1')
        .replace(/\d/g, 'x');

      var _lastFour = formattedValue.replace(
        /^([\d|\s]{0,15})([\d|\s]*?)$/,
        '$2'
      );

      return _masked + _lastFour;
    }

    var masked = formattedValue
      .replace(/^([\d|\s]*?)(?:\d{0,4}\s?)$/, '$1')
      .replace(/\d/g, 'x');
    var lastFour = formattedValue.replace(/^(?:[\d|\s]*?)(\d{0,4}\s?)$/, '$1');
    return masked + lastFour;
  }

  moveCursor(value) {
    const oldValue = this.maskNum.nativeElement.value;
    const oldLength = oldValue.length;
    const oldIndex = this.maskNum.nativeElement.selectionStart;
    const newLength = value.length;
    let cursorIndex = oldIndex;

    if (oldLength < newLength && oldLength === oldIndex) {
      cursorIndex += newLength - oldLength;
    } else if (
      value.charAt(oldIndex - 1) === ' ' &&
      oldValue.charAt(oldIndex) === ' '
    ) {
      cursorIndex += 1;
    }

    this.maskNum.nativeElement.value = value;
    this.maskNum.nativeElement.selectionStart = cursorIndex;
    this.maskNum.nativeElement.selectionEnd = cursorIndex;
  }

  onChange($event) {
    const cardNumber = String($event.target.value).replace(/\D/g, '');
    this.moveCursor(this.formatCardNumber(cardNumber, 'HD_PROX'));

    if (cardNumber === '6035 2943 1002 0070') {
      return;
    }

    this.cardNumber = cardNumber;
    console.log('change =====>>>', this.cardNumber);
  }

  onKeyDown($event) {
    const isBackspace = $event.keyCode === 8;

    if (
      isBackspace &&
      this.maskNum.nativeElement.value.charAt(
        this.maskNum.nativeElement.selectionStart - 1
      ) === ' '
    ) {
      this.maskNum.nativeElement.selectionStart -= 1;
      this.maskNum.nativeElement.selectionEnd -= 1;
    }
    console.log(
      'keydown =====>>>',
      this.maskNum.nativeElement.selectionStart,
      this.maskNum.nativeElement.selectionEnd
    );
  }

  onBlur($event) {
    this.setIsCardNumMasked(true);
    const value = $event.target.value;
    console.log('blur =====>>>', value);
    this.maskNum.nativeElement.value = this.maskCardNumber(
      this.cardNumber,
      'HD_PROX'
    );
  }

  onFocus($event) {
    this.setIsCardNumMasked(false);
    const value = $event.target.value;
    console.log('focus =====>>>', value);
    this.maskNum.nativeElement.value = this.formatCardNumber(
      this.cardNumber,
      'HD_PROX'
    );
  }
}
