import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements AfterViewInit {

  @Input() data: string = "";

  @Input() isReadonly = false;

  @Output() convert: EventEmitter<Object> = new EventEmitter<Object>();

  @Output() error: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('lineCounter') lineCounter? : ElementRef;

  @ViewChild('codeEditor') codeEditor? : ElementRef;

  ngAfterViewInit(): void {
    var codeEditor = this.codeEditor!.nativeElement as HTMLTextAreaElement;
    var lineCounter = this.lineCounter!.nativeElement as HTMLTextAreaElement;

    codeEditor.addEventListener('scroll', () => {
      lineCounter.scrollTop = codeEditor.scrollTop;
      lineCounter.scrollLeft = codeEditor.scrollLeft;
    });

    codeEditor.addEventListener('keydown', (e) => {
      let { keyCode } = e;
      let { value, selectionStart, selectionEnd } = codeEditor;

      if (keyCode === 9) {  // TAB = 9
        e.preventDefault();
        codeEditor.value = value.slice(0, selectionStart) + '    ' + value.slice(selectionEnd);
        codeEditor.setSelectionRange(selectionStart+4, selectionStart+4)
      }
    });

    var lineCountCache = 0;

    function line_counter() {
      var lineCount = codeEditor.value.split('\n').length;
      var outarr = new Array();
      if (lineCountCache != lineCount) {
        for (var x = 0; x < lineCount; x++) {
            outarr[x] = (x + 1) + '.';
        }
        lineCounter.value = outarr.join('\n');
      }
      lineCountCache = lineCount;
    }

    codeEditor.addEventListener('input', () => {
        line_counter();
    });
  }

  onChange(event: any): void {
    try {
      this.convert.emit(JSON.parse(event.target.value)); 
    }
    catch(error: any) {
      this.error.emit(error.message); 
    }
  } 
}
