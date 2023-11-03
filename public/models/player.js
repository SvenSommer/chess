export class Player {
    constructor(name, color, isHuman) {
        this.name = name;
        this.color = color;
        this.isHuman = isHuman
    }

    getName() {
        return this.name;
    }

    getColor() {
        return this.color;
    }

    isHuman(){
        return this.isHuman;
    }

}
