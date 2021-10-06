function injectMethods() {
    Creep.prototype.wander = () => {
        if (!this.fatigue) return;
        const direction = Math.floor((Math.random() * 8) + 1);
        this.move(direction);
    }
}