import { gameContainer, player, renderGameScore } from "./Context.js"

export class Obstacle {
    constructor() {
        this.x = window.innerWidth
        this.player = player
        this.speed = 6
        this.damageAmount = 10
        this.container = gameContainer
        this.element = this.createElement()
        this.active = true
    }

    createElement() {
        const obstacle = document.createElement('div')
        obstacle.classList.add('obstacle')
        obstacle.style.left = `${this.x}px`
        this.container.appendChild(obstacle) // Agregar al contenedor
        return obstacle
    }

    update() {
        if (!this.active) return

        // Mover el obstáculo hacia la izquierda
        this.x -= this.speed
        this.element.style.left = `${this.x}px`

        // Detectar colisiones con el jugador
        if (this.detectCollision()) {
            this.player.takeDamage(this.damageAmount)
            this.destroy()
            renderGameScore(-this.damageAmount/2)
        }

        // Si sale de la pantalla, remover el obstáculo
        if (this.x < -this.element.offsetWidth) {
            this.destroy()
            renderGameScore(this.damageAmount)
        }
    }

    detectCollision() {
        const obstacleRect = this.element.getBoundingClientRect()

        const playerRect = this.player.getDOMInfo()

        // Comparar las posiciones para detectar colisión
        return (
            obstacleRect.left < playerRect.right - playerRect.width/2 &&
            obstacleRect.right > playerRect.left + playerRect.width/2 &&
            playerRect.bottom > obstacleRect.top
        )
    }

    destroy() {
        this.active = false
        this.element.remove()
    }

}