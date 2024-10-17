import { Character } from "./Character.js";
import { gameContainer, player, renderGameScore } from "./Context.js";

const iniSpeed = 5

export class Gorgon extends Character {

    constructor(speedMultiplier) {
        super(100)
        this.totalHealth = 100
        this.x = window.innerWidth
        this.player = player
        this.speed = iniSpeed * speedMultiplier
        this.damageAmount = 20
        this.container = gameContainer
        this.element = this.createElement()
        this.active = true
    }

    takeDamage(amount) {
        super.takeDamage(amount)
        //barra de vida
        let value = `linear-gradient(to right, red 0%, red ${this.hp}%, #ffffff ${this.hp}%, #ffffff 100%)`
        this.element.style.setProperty('--gorgon-health-bar', value)
    }

    createElement() {
        const gorgonElement = document.createElement('div')
        gorgonElement.classList.add('gorgon')
        gorgonElement.classList.add('gorgon-idle')
        this.container.appendChild(gorgonElement)
        return gorgonElement
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
        const enemyRect = this.getDOMInfo()
        const playerRect = this.player.getDOMInfo()

        return (
            enemyRect.left + enemyRect.width/2 < playerRect.right - playerRect.width/2 &&
            enemyRect.right > playerRect.left + playerRect.width/2 &&
            playerRect.bottom > enemyRect.top + enemyRect.height/2
        )
    }

    destroy() {
        this.active = false
        this.element.remove()
    }

    clean() {
        this.element.classList.remove('gorgon-idle')
        this.element.classList.remove('gorgon-hurt')
    }

    addClass(className) {
        this.clean()
        this.element.classList.add(className)
    }

    die(){
        this.dieAnimation()
        this.speed = 0
    }
    
    dieAnimation(){
        this.clean()
        this.addClass('gorgon-die')
        this.element.addEventListener("animationend", () => {
            this.destroy()
        })
    }

    hurt(){
        this.clean()
        this.addClass('gorgon-hurt')
        this.element.addEventListener("animationend", () => {
            this.addClass('gorgon-idle')
        })
    }

}