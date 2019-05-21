function title(){
    
    const sprite = new PIXI.Sprite(sheet.textures["title.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        TITLE.renderer.view.hidden = true;
        MAIN.renderer.view.hidden = false;
    })

    
    //sprite.position.set(100,100)

    //document.body.appendChild(TITLE.view);
    document.body.appendChild(TITLE.view);
    TITLE.stage.addChild(sprite);
}

function main(){
    document.body.appendChild(MAIN.view);
    const sprite = new PIXI.Sprite(sheet.textures["red.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        MAIN.renderer.view.hidden = true;
        RESULT.renderer.view.hidden = false;
    })

    //sprite.position.set(100,100)

    //document.body.appendChild(TITLE.view);
    
    MAIN.stage.addChild(sprite);
}


function result(){
    const sprite = new PIXI.Sprite(sheet.textures["back_to_title.png"]);

    sprite.interactive = true;
    sprite.on('pointerdown',()=>{
        RESULT.renderer.view.hidden = true;
        TITLE.renderer.view.hidden = false;
    })

    //sprite.position.set(100,100)

    //document.body.appendChild(TITLE.view);
    document.body.appendChild(RESULT.view);
    RESULT.stage.addChild(sprite);
}
