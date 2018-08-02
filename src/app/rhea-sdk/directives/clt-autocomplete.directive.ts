import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[cltAutocomplete]'
})
export class CltAutocompleteDirective implements OnInit {

  @Input() source = [];
  @Input() property: string;
  @Input() model: FormGroup;
  @Input() filter: string;
  $globalContainer;
  $resultContainer;
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.$globalContainer = this.renderer.createElement('div');
    const $globalContainer = this.$globalContainer;

    this.renderer.insertBefore(this.el.nativeElement.parentElement, $globalContainer, this.el.nativeElement);
    this.renderer.appendChild($globalContainer, this.el.nativeElement);
    this.$resultContainer = this.renderer.createElement('ul');
    const $resultContainer = this.$resultContainer;
    setTimeout(() => {
      this.renderer.setStyle($resultContainer, 'width', this.el.nativeElement.offsetWidth + 'px');
    });
    this.renderer.setStyle($resultContainer, 'position', 'absolute');
    this.renderer.setStyle($resultContainer, 'background-color', 'white');
    const border = 'var(--contentBorderWidth) solid var(--contentBorderColor)';
    this.renderer.setStyle($resultContainer, 'border-left', border);
    this.renderer.setStyle($resultContainer, 'border-bottom', border);
    this.renderer.setStyle($resultContainer, 'border-right', border);
    this.renderer.setStyle($resultContainer, 'max-height', '50vh');
    this.renderer.setStyle($resultContainer, 'overflow-y', 'auto');
    this.renderer.setStyle($resultContainer, 'display', 'none');
    this.renderer.appendChild($globalContainer, $resultContainer);
    const focus = this.renderer.listen(this.el.nativeElement, 'focus', $ev => {
      this.renderer.setStyle($resultContainer, 'display', 'block');
      const focusout = this.renderer.listen(this.el.nativeElement, 'focusout', $evout => {
        setTimeout(() => {
          this.renderer.setStyle($resultContainer, 'display', 'none');
        });
        focusout();
      });
    });
    this.updateView();
    this.renderer.listen(this.el.nativeElement, 'keyup', ({target}) => {
      this.updateView(target.value);
    });
  }

  updateView(filter = '') {
    Array.from(this.$resultContainer.children).forEach(child => {
      this.renderer.removeChild(this.$resultContainer, child);
    });
    this.source.filter(item => {
      return (item[this.property] || item).toUpperCase().includes(filter.toUpperCase());
    }).map(item => {
      const $item = this.renderer.createElement('li');
      const $text = this.renderer.createText(item[this.property] || item);
      this.renderer.appendChild($item, $text);
      this.renderer.setStyle($item, 'padding', '10px');
      this.renderer.setStyle($item, 'border-bottom', 'var(--contentBorderWidth) solid var(--contentBorderColor)');
      this.renderer.listen($item, 'click', $ev => {
        const value = $ev.target.innerText;
        if (this.model) this.model.setValue(value);
        else this.el.nativeElement.value = value;
      });
      this.renderer.appendChild(this.$resultContainer, $item);
    });
  }
}
