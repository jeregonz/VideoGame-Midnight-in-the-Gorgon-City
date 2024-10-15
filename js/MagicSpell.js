import { enemies } from "./main.js"
import { gameContainer, renderGameScore } from "./Context.js";

const startX = 140
const initialDamage = 15

export class MagicSpell {

    constructor() {
        this.x = startX
        this.speed = 10
        this.damageAmount = initialDamage
        this.container = gameContainer
        this.element = this.createElement()
        this.destroy()
    }

    // Método para crear el div del proyectil
    createElement() {
        const projectile = document.createElement('div')
        projectile.classList.add('magic-spell')
        projectile.style.left = `${this.x}px`
        this.container.appendChild(projectile)
        return projectile
    }

    // Función para verificar colisiones con enemigos
    checkCollision() {
        const spellRect = this.element.getBoundingClientRect()

        for (let enemy of enemies) {
            const enemyRect = enemy.getDOMInfo()
            const spellCenterX = spellRect.left + (spellRect.width / 2)
            const enemyCenterX = enemyRect.left + (enemyRect.width / 2)
            const collisionDistance = 40 // Ajusta según el tamaño
        
            // Si detecta colisión
            if (Math.abs(spellCenterX - enemyCenterX) < collisionDistance) {
                enemy.takeDamage(this.damageAmount) // Infligir daño
                renderGameScore(this.damageAmount) // Actualizar puntaje
                return true
            }
        }
        return false
    }

    activate(bonus) {
        this.active = true
        this.x = startX
        this.damageAmount = initialDamage + bonus
        this.element.style.display = 'block' // Hacer visible el proyectil
    }

    destroy() {
        this.active = false
        this.element.style.display = 'none' // Hacerlo invisible
    }

    update() {
        this.x += this.speed
        this.element.style.left = `${this.x}px`

        // Comprobar colisión con el enemigo
        if (this.checkCollision()) {
            this.destroy()
        }

        // Si sale de la pantalla, eliminar el proyectil
        if (this.x > window.innerWidth) {
            this.destroy()
        }
    }



}

