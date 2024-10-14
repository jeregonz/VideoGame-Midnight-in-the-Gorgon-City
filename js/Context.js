export const gameContainer = document.getElementById('game-container')

export let player = null
export function setPlayer(newPlayer) {
    player = newPlayer
}

const bonusInfo = document.getElementById('bonus-power')
export function renderBonusPower() {
    bonusInfo.textContent = `+${player.getBonusPower()}`

    // Añadir la clase para la animación
    bonusInfo.classList.add('flash')

    // Remover la clase después de la animación (1s)
    setTimeout(() => {
        bonusInfo.classList.remove('flash')
    }, 1000)  // 1 segundo coincide con la duración de la animación en CSS
}

/** puntuacion */
const scoreElement = document.getElementById('score')
export let gameScore = 0
export function setGameScore(newScore) {
    gameScore = newScore
}
export function renderGameScore(addPoints) {
    scoreElement.textContent = `Puntos: ${gameScore+=addPoints}`
}

const hpInfo = document.getElementById('health-points')
export function renderHealthPoints() {
    hpInfo.textContent = player.getHp()

    // Añadir la clase para la animación
    hpInfo.classList.add('flash')

    // Remover la clase después de la animación (1s)
    setTimeout(() => {
        hpInfo.classList.remove('flash')
    }, 1000)  // 1 segundo coincide con la duración de la animación en CSS
}