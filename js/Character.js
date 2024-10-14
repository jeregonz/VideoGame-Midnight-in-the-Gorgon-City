export class Character {

    constructor(hp){
        this.hp = hp//health points
    }

    getDOMInfo() {
        return this.element.getBoundingClientRect()
    }

    // Método para recibir daño
    takeDamage(amount) {
        this.hp -= amount
        console.log(`Recibido ${amount} de daño. HP restante: ${this.hp}`)

        if (!this.isDead())
            this.hurt()
        else
            this.die()
    }

    // Método que se ejecuta cuando el personaje muere
    die() {}

    isDead() {
        return this.hp <= 0
    }
    
    hurt(){}
}