class Game {
  constructor(menuInit) {
    this.menuInit = menuInit;
    this.wave = 0;
    this.movementKeyMap = {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }
    this.state = {
      waveActive: false,
      entities: [],
      bullets: [],
      storeIsOpen: false,
      moveDirections: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
      rotateDirection: null,
      canShoot: true,
      fire: false,
      wave: 0,
      playerHealth: 10,
      zombieSpeedMultiplier: 1,
      zombieHealthMultiplier: 1,
      zombieStrengthMultiplier: 1,
      damageModifier: 1,
      money: 10,
      relPlayerPosition: {
        x: 475,
        y: 275,
        deg: 0
      }
    };
  }

  addMoney(amount) {
    this.state.money += amount;
    this.moneyBanner.innerHTML = "Money: " + this.state.money;
  }

  hurtPlayer() {
    this.state.playerHealth -= Math.round(1 * this.state.zombieStrengthMultiplier);
    if (this.state.playerHealth <= 0) {
      this.endGame();
    }
    this.healthBanner.innerHTML = 'Health: ' + this.state.playerHealth;
  }

  move(direction) {
    const allDirections = {
      up: -10,
      down: 10,
      left: -10,
      right: 10
    }
    direction === 'up' || direction === 'down' ? this.state.relPlayerPosition.y = this.state.relPlayerPosition.y + allDirections[direction] : this.state.relPlayerPosition.x = this.state.relPlayerPosition.x + allDirections[direction]
  }

  rotate(direction) {
    if (direction === 'left') {
      this.state.relPlayerPosition.deg = this.state.relPlayerPosition.deg - 10
    } else {
      this.state.relPlayerPosition.deg = this.state.relPlayerPosition.deg + 10
    }
  }

  handleKeyboardEvent(e) {
    const handleMovementKey = (direction) => {
      if (e.type === 'keydown') this.state.moveDirections[direction] = true;
      if (e.type === 'keyup') this.state.moveDirections[direction] = false;
    }
    if (this.movementKeyMap[e.key]) {
      handleMovementKey(this.movementKeyMap[e.key]);
      return;
    }
    switch(e.key) {
      case 'ArrowLeft' :
        if (e.type === 'keydown') this.state.rotateDirection = 'left';
        if (e.type === 'keyup' && this.state.rotateDirection === 'left') this.state.rotateDirection = null;
        return;
        case 'ArrowRight' :
        if (e.type === 'keydown') this.state.rotateDirection = 'right';
        if (e.type === 'keyup' && this.state.rotateDirection === 'right') this.state.rotateDirection = null;
        return;
      case ' ' :
        if (e.type === 'keydown') this.state.fire = true;
        if (e.type === 'keyup') this.state.fire = false;
        return;
      default :
        return;
    }
  }

  handleEvents(e) {
    if (
      e.type === 'mousemove'
      || e.type === 'click'
    ) {
      this.handleMouseEvent(e);
      return;
    }
    if (
      e.type === 'keydown'
      || e.type === 'keyup'
    ) {
      this.handleKeyboardEvent(e);
      return;
    }
  }

  refreshCanvas() {
    this.createStage();
    this.tickEntities();
    this.state.absPlayerPosition = Utils.getAbsPosition(this.state.relPlayerPosition, 0, { x: 475, y: 275 });
    player(this.ctx, this.state.relPlayerPosition.x, this.state.relPlayerPosition.y, this.state.relPlayerPosition.deg);
    this.handleBullets(this.state.bullets);
    let conflicts = Utils.checkForConflicts(this.state.bullets, this.state.entities);
    if (conflicts !== undefined) {
      this.handleConflicts(conflicts);
    }
  }

  tickEntities() {
    for (let i = 0; i < this.state.entities.length; i++) {
      if (this.state.entities[i].health > 0) {
        this.state.entities[i].tick(this.ctx, this.state.absPlayerPosition);
      } else {
        this.state.entities.splice(i, 1);
        this.addMoney(5);
        this.zombieCountBanner.innerHTML = `${this.state.entities.length} Zombies Left`;
      }
    }
  }

  handleConflicts(conflicts) {
    for (let i = 0; i < conflicts.length; i++) {
      // console.log(conflicts[i]);
      conflicts[i].health = conflicts[i].health - (1 * this.state.damageModifier);
    }
  }

  shoot() {
    const bullet = new Bullet(this.ctx, this.state.relPlayerPosition.x, this.state.relPlayerPosition.y, this.state.relPlayerPosition.deg);
    this.state.bullets.push(bullet);
    this.state.canShoot = false;
    bullet.init();
    setTimeout(() => {
      this.state.canShoot = true;
    }, 300)
    setTimeout(() => {
      this.state.bullets.shift();
    }, 2000)
  }

  handleBullets(bullets) {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].tick(this.ctx);
    }
  }

  tick() {
    if (this.state.moveDirections) {
      Object.keys(this.state.moveDirections).forEach(d => { if (this.state.moveDirections[d]) this.move(d) });
    }
    if (this.state.rotateDirection) {
      this.rotate(this.state.rotateDirection);
    }
    if (this.state.fire && this.state.canShoot) {
      this.shoot();
    }
    this.refreshCanvas();
    if (this.waveActive) {
      if (this.state.entities.length === 0) {
        this.waveOver();
      }
    }
  }

  gameLoop() {
    return setInterval(() => {
      this.tick();
    }, 75);
  }

  createStage() {
    this.stage = document.createElement('canvas');
    this.stage.id = "game-canvas";
    this.stage.height = "600";
    this.stage.width = "1000";
    this.ctx = this.stage.getContext('2d');
    let oldCanvas = document.getElementById('game-canvas');
    if (oldCanvas) {
      document.body.removeChild(oldCanvas);
    }
    document.body.appendChild(this.stage);
  }

  openStore() {
    this.pause();
    document.body.appendChild(this.store);
  }

  closeStore() {
    this.resume();
    document.body.removeChild(this.store);
  }

  createStore() {
    this.store = document.createElement('div');
    this.store.id = 'store';
    this.store.onclick = (e) => e.stopPropagation();

    const storeHeader = document.createElement('h1');
    storeHeader.innerHTML = "$ Store $";
    storeHeader.style.width = "100%";
    storeHeader.style.textAlign = "center";
    this.store.appendChild(storeHeader);

    const storeBody = document.createElement('div');
    storeBody.style.display = "flex";
    storeBody.id = "store-body";
    this.store.appendChild(storeBody);

    const storeItems = [
      {
        name: "Upgrade gun",
        price: 10,
        icon: "../assets/gun.png",
        onPurchase: () => {
          this.state.damageModifier += 0.1;
        }
      },
      {
        name: "Health",
        price: 10,
        icon: "../assets/health_potion.png",
        onPurchase: () => {
          this.state.playerHealth += 1;
          this.healthBanner.innerHTML = 'Health: ' + this.state.playerHealth;
        }
      }
    ];
    for (const item of storeItems) {
      const itemContainer = document.createElement('div');
      const itemButton = document.createElement('button');
      itemButton.className = 'icon-button';
      itemButton.style.margin = "5px";
      itemButton.style.backgroundImage = `url(${item.icon})`;
      itemButton.onclick = () => {
        if (this.state.money < item.price) {
          const messages = [
            "You're broke...",
            "Go kill more zombies!",
            "What are you doing, you know you can't afford that.",
            "hahahahahahaha.... you can't buy that",
          ];
          alert(messages.at(Math.random() * messages.length));
          return;
        }
        this.addMoney(-item.price);
        item.onPurchase();
      };
      const itemDescription = document.createElement('p');
      itemDescription.innerHTML = `$${item.price} - ${item.name}`;
      itemDescription.style.color = 'black';
      itemDescription.style.width = '100px';
      itemDescription.style.textAlign = 'center';
      itemContainer.appendChild(itemDescription);
      itemContainer.appendChild(itemButton);
      storeBody.appendChild(itemContainer);
    }

    this.closeStoreButton = document.createElement('button');
    this.closeStoreButton.id = "close-store-button";
    this.closeStoreButton.className = "icon-button";
    this.closeStoreButton.onclick = () => this.closeStore();
    this.store.appendChild(this.closeStoreButton);

    this.openStoreButton = document.createElement('button')
    this.openStoreButton.id = "open-store-button";
    this.openStoreButton.className = "icon-button";
    this.openStoreButton.onclick = () => this.openStore();
    document.body.appendChild(this.openStoreButton);
  }

  createExitButton() {
    this.exitButton = document.createElement('button');
    this.exitButton.id = "exit-button";
    this.exitButton.innerHTML = 'EXIT GAME';
    this.exitButton.onclick = () => { this.endGame(); }
    document.body.appendChild(this.exitButton);
  }

  createWaveBanner() {
    this.waveBanner = document.createElement('h1');
    this.waveBanner.innerHTML = 'WAVE ' + this.wave;
    this.waveBanner.id = 'wave-banner';
    document.body.appendChild(this.waveBanner);
  }

  createStartWaveButton() {
    this.startWaveButton = document.createElement('button');
    this.startWaveButton.innerHTML = 'START NEXT WAVE';
    this.startWaveButton.id = 'start-wave-button';
    this.startWaveButton.onclick = () => {
      this.startNextWave();
    }
    document.body.appendChild(this.startWaveButton);
  }

  createBanners() {
    this.healthBanner = document.createElement('h1');
    this.healthBanner.id = 'health-banner';
    this.healthBanner.innerHTML = 'Health: ' + this.state.playerHealth;
    this.healthBanner.style.color = 'red';
    this.moneyBanner = document.createElement('h1');
    this.moneyBanner.id = 'money-banner';
    this.moneyBanner.innerHTML = 'Money: ' + this.state.money;
    this.moneyBanner.style.color = 'green';
    this.banners = document.createElement('dev');
    this.banners.id = 'banners';
    this.banners.appendChild(this.healthBanner);
    this.banners.appendChild(this.moneyBanner);
    document.body.appendChild(this.banners);
  }

  startNextWave() {
    this.waveActive = true;
    this.wave ++;
    this.waveBanner.innerHTML = 'WAVE ' + this.wave;
    document.body.removeChild(this.startWaveButton);
    if (this.wave % 10 === 0) this.state.zombieSpeedMultiplier = 2;
    this.generateZombies();
    this.createZombieCountBanner();
  }

  createZombieCountBanner() {
    this.zombieCountBanner = document.createElement('h2');
    this.zombieCountBanner.id = 'zombie-count-banner';
    this.zombieCountBanner.innerHTML = `${this.state.entities.length} Zombies Left`;
    document.body.appendChild(this.zombieCountBanner);
  }

  generateZombies() {
    while(this.state.entities.length < this.wave * 3) {
      this.state.entities.push(new Zombie(this.ctx, this.hurtPlayer.bind(this), (Math.random() * 6 + 1) * this.state.zombieSpeedMultiplier, 5 * this.state.zombieHealthMultiplier));
    }
  }

  waveOver() {
    document.body.appendChild(this.startWaveButton);
    document.body.removeChild(this.zombieCountBanner);
    this.waveActive = false;
    this.state.zombieSpeedMultiplier = 1;
    this.state.zombieHealthMultiplier += 0.1;
    this.state.zombieStrengthMultiplier += 0.1;
  }

  endGame() {
    console.log('Game Ended');
    if (this.waveActive) { this.waveOver(); }
    clearInterval(this.game);
    document.body.removeChild(this.stage);
    document.body.removeChild(this.exitButton);
    document.body.removeChild(this.startWaveButton);
    document.body.removeChild(this.banners);
    document.body.removeChild(this.waveBanner);
    document.body.removeChild(this.openStoreButton);
    this.menuInit();
  }

  controllerInit() {
    window.addEventListener('keydown', this.handleEvents.bind(this));
    window.addEventListener('keyup', this.handleEvents.bind(this));
  }

  testDummyInit() {
    let testDummy = {
      position: { x: 475, y: 245 },
      paint: this.paintTestDummy.bind(this),
      health: 5
    }
    this.state.entities.push(testDummy);
  }

  paintTestDummy(health) {
    let x = 475;
    let y = 245;
    this.dummyPosition = Utils.getAbsPosition({ x, y }, 0, { x, y });
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(x, y, 30, 30);
    this.ctx.fillStyle = 'rgb(255, 0, 0)';
    this.ctx.fillRect(x, y, 30, 5);
    this.ctx.fillStyle = 'rgb(0, 255, 0)';
    this.ctx.fillRect(x, y, health * 6, 5);
  }

  pause() {
    clearInterval(this.game);
  }

  resume() {
    this.game = this.gameLoop();
  }

  init() {
    this.createWaveBanner();
    this.createBanners();
    this.createStage();
    this.createExitButton();
    this.createStartWaveButton();
    this.createStore();
    // this.testDummyInit();
    this.controllerInit();
    player(this.ctx, this.state.relPlayerPosition.x, this.state.relPlayerPosition.y, this.state.relPlayerPosition.deg);
    this.game = this.gameLoop();
  }
}