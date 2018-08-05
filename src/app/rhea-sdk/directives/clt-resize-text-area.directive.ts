import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[cltResizeTextArea]'
})
export class CltResizeTextAreaDirective implements OnInit, OnDestroy{
  event;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    var tx = this.el.nativeElement
    tx.setAttribute('style', 'height:' + (tx.scrollHeight) + 'px;overflow-y:hidden;');
    this.resize(tx)
    this.event = this.renderer.listen(tx, 'input', _ => {
      this.resize(tx)
    })
    tx.focus();
    tx.select();
  }
  
  resize(tx) {
    this.renderer.setStyle(this.el.nativeElement, 'height', 'auto')
    this.renderer.setStyle(this.el.nativeElement, 'height', tx.scrollHeight + 'px') 
  }
  ngOnDestroy() {
    this.event()
  }
}
