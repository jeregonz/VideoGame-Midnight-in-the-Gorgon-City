export class Character {

    constructor(hp){
        this.hp = hp//health points
    }

    getDOMInfo() {
        return this.element.getBoundingClientRect()
    }

    takeDamage(amount) {
        this.hp -= amount

        if (!this.isDead())
            this.hurt()
        else
            this.die()
    }

    die() {}

    isDead() {
        return this.hp <= 0
    }
    
    hurt(){}
}