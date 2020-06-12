import $ from 'jquery';

export class Modal {
    static BOX_MARGIN: number = 20;
    static MODAL_OPEN: string = 'modalOpen';
    static MODAL_CLOSE: string = 'modalClose';
    static SCENE_CHANGE: string = 'sceneChange';

    private $modal: JQuery;
    private $frame: JQuery;
    private $loading: JQuery;
    private $close: JQuery;

    private currentSceneNum: number;
    private readonly sceneList: JQuery[];
    private readonly numScenes: number;

    constructor(modalId: string) {
        this.$modal = $('#' + modalId);
        this.$frame = this.$modal.find('.modal__frame');
        this.$loading = this.$modal.find('.modal__loading');
        this.$close = this.$modal.find('.modal__close');

        this.currentSceneNum = 0;
        this.sceneList = [];

        this.$frame
            .find('.modal__scene')
            .each((index: number, element: HTMLElement) => {
                this.sceneList.push($(element));
            });
        this.numScenes = this.sceneList.length;

        this.$close.on('click', this.close);

        this.init();
        $(window).on('resize', this.frameHeightAdjust);
    }

    static scrollDisable(): void {
        const $body: JQuery = $('body');

        $body
            .css({
                position: 'fixed',
                top: $(window).scrollTop() * -1 + 'px',
                width: $(window).width() + 'px',
                height: $(window).height() + 'px'
            });
    }

    static scrollEnable(): void {
        const $body: JQuery = $('body');
        const scrollY: number = parseInt($body.css('top')) * -1;

        $body
            .css({
                position: '',
                top: '',
                width: '',
                height: ''
            });

        $(window).scrollTop(scrollY);
    }

    private init(): void {
        this.$modal
            .addClass('isClose')
            .removeClass('isOpen')
            .removeClass('isAnimated')
            .removeClass('modal--openAnim')
            .removeClass('modal--closeAnim')
            .off('animationend webkitAnimationEnd');

        this.$loading
            .addClass('isHide')
            .removeClass('isShow');

        let i: number = this.numScenes;
        for (; i--;) {
            this.sceneList[i]
                .addClass('isHide')
                .removeClass('isShow')
                .removeClass('isAnimated')
                .removeClass('modal--transitionSceneAnim')
                .off('animationend webkitAnimationEnd');
        }

        this.currentSceneNum = 0;
        this.changeScene(0, true);
    }

    private frameHeightAdjust(): void {
        const winH: number = $(window).height();

        this.$frame
            .css({
                top: 'auto',
                height: 'auto',
                overflow: 'visible'
            });

        const frameH: number = this.$frame.outerHeight();

        if (frameH + Modal.BOX_MARGIN * 2 > winH) {
            this.$frame
                .css({
                    top: Modal.BOX_MARGIN + 'px',
                    height: winH - Modal.BOX_MARGIN * 2,
                    overflow: 'auto'
                });
        }

        this.$frame.scrollTop(0);
    }

    public hasPrev(): boolean {
        return this.currentSceneNum - 1 >= 0;
    }

    public hasNext(): boolean {
        return this.currentSceneNum + 1 < this.numScenes;
    }

    public addEventListener(eventType: string, handler: () => void): void {
    }

    public removeEventListener(eventType: string, handler: () => void): void {
    }

    public dispatchEvent(eventType: string): void {
    }

    public open(): void {
        if (this.$modal.hasClass('isAnimated')) {
            return;
        }

        Modal.scrollDisable();

        this.$modal
            .on('animationend webkitAnimationEnd', () => {
                this.$modal
                    .removeClass('modal--openAnim')
                    .removeClass('isAnimated')
                    .addClass('isOpen')
                    .off('animationend webkitAnimationEnd');
                this.dispatchEvent(Modal.MODAL_OPEN);
            })
            .removeClass('isClose')
            .addClass('modal--openAnim')
            .addClass('isAnimated');

        this.frameHeightAdjust();
    }

    public close(): void {
        if (this.$modal.hasClass('isAnimated')) {
            return;
        }

        Modal.scrollEnable();

        this.$modal
            .on('animationend webkitAnimationEnd', () => {
                this.$modal
                    .removeClass('modal--closeAnim')
                    .removeClass('isAnimated')
                    .addClass('isClose')
                    .off('animationend webkitAnimationEnd');

                this.init();
                this.dispatchEvent(Modal.MODAL_OPEN);
            })
            .removeClass('isOpen')
            .addClass('modal--closeAnim')
            .addClass('isAnimated');
    }

    public showLoading(): void {
        this.$loading
            .removeClass('isHide')
            .addClass('isShow');
    }

    public hideLoading(): void {
        this.$loading
            .removeClass('isShow')
            .addClass('isHide');
    }

    public changeScene(sceneNum: number, noAnimation: boolean = false): void {
        const $scene: JQuery = this.sceneList[sceneNum];

        if (!$scene || $scene.hasClass('isAnimated')) {
            return;
        }

        this.sceneList[this.currentSceneNum]
            .removeClass('isShow')
            .addClass('isHide');

        if (noAnimation) {
            $scene
                .removeClass('isHide')
                .addClass('isShow');

            this.frameHeightAdjust();
            this.currentSceneNum = sceneNum;
            this.dispatchEvent(Modal.SCENE_CHANGE);
        } else {
            $scene
                .on('animationend webkitAnimationEnd', () => {
                    $scene
                        .removeClass('modal--transitionSceneAnim')
                        .removeClass('isAnimated')
                        .addClass('isShow')
                        .off('animationend webkitAnimationEnd');

                    this.currentSceneNum = sceneNum;
                    this.dispatchEvent(Modal.SCENE_CHANGE);
                })
                .removeClass('isHide')
                .addClass('modal--transitionSceneAnim')
                .addClass('isAnimated');

            this.frameHeightAdjust();
        }
    }

    public prevScene(noAnimation: boolean = false): void {
        if (this.hasPrev()) {
            this.changeScene(this.currentSceneNum - 1, noAnimation);
        }
    }

    public nextScene(noAnimation: boolean = false): void {
        if (this.hasNext()) {
            this.changeScene(this.currentSceneNum + 1, noAnimation)
        }
    }
}