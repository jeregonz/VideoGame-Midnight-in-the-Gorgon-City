import { Character } from "./Character.js";
import { gameContainer, renderHealthPoints } from "./Context.js";

const initialHP = 10

export class Player extends Character {

    constructor() {
        super(initialHP)
        this.container = gameContainer
        this.element = this.createElement()
        this.iniTop = this.getDOMInfo().top
        this.bonusPower = 0
        this.canAttack = true
        this.isJumping = false
    }

    reset(){
        this.hp = initialHP
        this.bonusPower = 0
        this.element = this.createElement()
    }

    createElement() {
        const playerElement = document.createElement('div')
        playerElement.classList.add('player')
        playerElement.classList.add('run')
        this.container.appendChild(playerElement) // Agregar al contenedor
        return playerElement
    }

    getIniTop(){
        return this.iniTop
    }

    getHp() {
        return this.hp
    }

    takeHpBonus(bonus) {
        this.hp += bonus
    }

    getBonusPower() {
        return this.bonusPower
    }

    takePowerBonus(bonus) {
        this.bonusPower+=bonus
    }

    takeDamage(damageAmount) {
        super.takeDamage(damageAmount)
        renderHealthPoints()
    }

    destroy() {
        this.element.remove()
    }

    /**
     * reinicia las clases css del player
     */
    clean() {
        this.element.classList.remove("run")
        this.element.classList.remove("jump")
        this.element.classList.remove("attack")
        this.element.classList.remove("die")
        this.element.classList.remove("hurt")
    }

    addClass(className) {
        this.clean()
        this.element.classList.add(className)
    }

    run() {
        this.addClass('run')
        this.isJumping = false
    }

    jump() {
        this.addClass('jump')
        this.isJumping = true
        this.element.addEventListener("animationend", () => {
            this.run()
        })
    }
    
    attack() {
        this.addClass('attack')
        this.element.addEventListener("animationend", () => {
            this.run()
        })
    }

    die(){
        console.log(`${this.constructor.name} ha muerto.`)
        // Aquí puedes manejar la lógica de la muerte (ej: remover del DOM, animación de muerte, etc.)
        this.dieAnimation()
    }

    dieAnimation() {
        this.addClass('die')
    }

    hurt() {
        this.addClass('hurt')
        this.element.addEventListener("animationend", () => {
            this.run()
        })
    }
}