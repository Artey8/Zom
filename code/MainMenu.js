class MainMenu {
  constructor() {
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = "menu-container";
    this.newGameButton = document.createElement('button');
    this.newGameButton.id = "new-game-button";
    this.newGameButton.className = "menu-button";
    this.newGameButton.innerHTML = 'New Game';
    this.newGameButton.onclick = () => { this.startGame(); };
    this.menuContainer.appendChild(this.newGameButton);
  }
  init() {
    console.log('Menu Init');
    document.body.appendChild(this.menuContainer);
  }
  close() {
    document.body.removeChild(this.menuContainer);
  }
  startGame() {
    console.log('Game Started');
    this.close();
    const newGame = new Game(this.init.bind(this));
    newGame.init();
  }
}

const newMenu = new MainMenu();
newMenu.init();