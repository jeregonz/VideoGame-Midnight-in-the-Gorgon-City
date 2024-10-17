import { gameContainer, player, renderGameScore } from "./Context.js"

const iniSpeed = 6

export class Obstacle {
    constructor(speedMultiplier) {
        this.x = window.innerWidth
        this.player = player
        this.speed = iniSpeed * speedMultiplier
        this.damageAmount = 10
        this.container = gameContainer
        this.element = this.createElement()
        this.active = true
    }

    createElement() {
        const obstacle = document.createElement('div')
        obstacle.classList.add('obstacle')
        obstacle.style.left = `${this.x}px`
        this.container.appendChild(obstacle)
        return obstacle
    }

    update() {
        if (!this.active) return

        this.x -= this.speed
        this.element.style.left = `${this.x}px`

        if (this.detectCollision()) {
            this.player.takeDamage(this.damageAmount)
            this.destroy()
            renderGameScore(-this.damageAmount/2)
        }

        if (this.x < -this.element.offsetWidth) {
            this.destroy()
            renderGameScore(this.damageAmount)
        }
    }

    detectCollision() {
        const obstacleRect = this.element.getBoundingClientRect()

        const playerRect = this.player.getDOMInfo()

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