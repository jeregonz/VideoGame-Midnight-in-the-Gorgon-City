import { gameContainer, player, renderBonusPower } from "./Context.js"

export class PowerBonus {
    constructor() {
        this.x = window.innerWidth
        this.player = player
        this.speed = 5
        this.bonusAmount = 10
        this.container = gameContainer
        this.element = this.createElement()
        this.active = true
    }

    createElement() {
        const bonus = document.createElement('div')
        bonus.classList.add('power-bonus')
        bonus.style.left = `${this.x}px`
        this.container.appendChild(bonus)
        return bonus
    }

    update() {
        if (!this.active) return

        this.x -= this.speed
        this.element.style.left = `${this.x}px`

        // Detectar colisiones con el jugador
        if (this.detectCollision()) {
            this.applyBonus()
            this.destroy()
        }

        // Si sale de la pantalla, destruir el bonus
        if (this.x < -this.element.offsetWidth) {
            this.destroy()
        }
    }

    detectCollision() {
        const bonusRect = this.element.getBoundingClientRect()
        const playerRect = this.player.getDOMInfo()

        return (
            bonusRect.left < playerRect.right - playerRect.width/2 &&
            bonusRect.right > playerRect.left &&
            this.player.isJumping()
        )
    }

    applyBonus() {
        this.player.takePowerBonus(this.bonusAmount)
        renderBonusPower()
    }

    destroy() {
        this.active = false
        this.element.remove()
    }

}
