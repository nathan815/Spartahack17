"use strict";
var core_1 = require('@angular/core');
/**
 * @element ons-pull-hook
 * @directive OnsPullHook
 * @selector ons-pull-hook
 * @description
 *   [en]Angular 2 directive for `<ons-pull-hook>` component.[/en]
 *   [ja]`<ons-pull-hook>`要素のためのAngular2ディレクティブです。[/ja]
 * @example
 *   @Component({
 *     selector: 'app',
 *     template: `
 *     <ons-page>
 *       <ons-toolbar>
 *         <div class="center">Pull Hook</div>
 *       </ons-toolbar>
 *       <div class="content">
 *         <ons-pull-hook height="64px" threshold-height="128px"
 *           (changestate)="onChangeState($event)" (action)="onAction($event)">
 *           {{message}}
 *         </ons-pull-hook>
 *       </div>
 *     </ons-page>
 *     `
 *   })
 *   export class AppComponent {
 *     message: string = 'Pull down to refresh';
 *
 *     onAction($event) {
 *       setTimeout(() => {
 *         $event.done();
 *       }, 1000);
 *     }
 *
 *     onChangeState($event) {
 *       switch ($event.state) {
 *         case 'initial':
 *           this.message = 'Pull down to refresh';
 *           break;
 *         case 'preaction':
 *           this.message = 'Release to refresh';
 *           break;
 *         case 'action':
 *           this.message = 'Loading data...';
 *           break;
 *       }
 *     }
 *   }
 */
var OnsPullHook = (function () {
    /**
     * @output changestate
     * @param {Object} $event
     * @param {String} $event.state
     * @desc
     *   [en][/en]
     *   [ja]`ons-pull-hook`要素の状態が変わった時に呼び出されます。[/ja]
     */
    function OnsPullHook(_elementRef) {
        var _this = this;
        this._elementRef = _elementRef;
        /**
         * @output action
         * @param {Object} $event
         * @param {Function} $event.done
         * @desc
         *   [en]Action to trigger.[/en]
         *   [ja]`ons-pull-hook`要素のアクションが必要なときに呼び出されます。[/ja]
         */
        this.action = new core_1.EventEmitter();
        this._element = _elementRef.nativeElement;
        this._element.onAction = function (done) { return _this.action.emit({ done: done }); };
    }
    OnsPullHook.prototype.ngOnDestroy = function () {
        this._element.onAction = null;
        this._element = null;
    };
    OnsPullHook.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ons-pull-hook'
                },] },
    ];
    /** @nocollapse */
    OnsPullHook.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
    ]; };
    OnsPullHook.propDecorators = {
        'action': [{ type: core_1.Output, args: ['action',] },],
    };
    return OnsPullHook;
}());
exports.OnsPullHook = OnsPullHook;
//# sourceMappingURL=ons-pull-hook.js.map