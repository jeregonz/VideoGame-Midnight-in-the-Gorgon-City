import { renderHealthPoints } from "./Context.js";
import { PowerBonus } from "./PowerBonus.js";

export class HealthBonus extends PowerBonus{
    constructor() {
        super()
    }

    createElement() {
        const bonus = document.createElement('div')
        bonus.classList.add('hp-bonus')
        bonus.style.left = `${this.x}px`
        // bonus.style.top = `${this.y}px`
        this.container.appendChild(bonus)
        return bonus
    }

    applyBonus() {
        // Aplicar el efecto de bonus
        this.player.takeHpBonus(this.bonusAmount)
        renderHealthPoints()
        console.log("Bonus aplicado: Salud aumentada!")
    }

}