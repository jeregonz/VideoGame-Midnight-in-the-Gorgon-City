import { Character } from "./Character.js";
import { gameContainer, player, renderGameScore } from "./Context.js";

export class Gorgon extends Character {

    constructor() {
        super(100)
        this.totalHealth = 100
        this.x = window.innerWidth
        this.player = player
        this.speed = 5
        this.damageAmount = 10
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

        // Mover el obstáculo hacia la izquierda
        this.x -= this.speed
        this.element.style.left = `${this.x}px`

        // Detectar colisiones con el jugador
        if (this.detectCollision()) {
            this.player.takeDamage(this.damageAmount)
            this.destroy()
            renderGameScore(-this.damageAmount/2)
        }

        // Si sale de la pantalla, remover
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
        console.log(`${this.constructor.name} ha muerto.`)
        // Aquí puedes manejar la lógica de la muerte (ej: remover del DOM, animación de muerte, etc.)
        this.dieAnimation()
        this.speed = 0
        setTimeout(() => {
            this.destroy() // Eliminar del DOM si es necesario
        }, 400);
    }
    
    dieAnimation(){
        this.clean()
        this.addClass('gorgon-die')
    }

    hurt(){
        this.clean()
        this.addClass('gorgon-hurt')
        this.element.addEventListener("animationend", () => {
            this.addClass('gorgon-idle')
        })
    }

}