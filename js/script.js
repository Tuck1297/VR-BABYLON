var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = async function () {

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0,0,10, new BABYLON.Vector3(0,0,0), scene);

    camera.inputs.attached.mousewheel.detachControl(canvas);

    var dome = new BABYLON.PhotoDome(
        "testdome", 
        "https://raw.githubusercontent.com/Tuck1297/VR-BABYLON/main/media/test.jpg", 
        {
            resolution: 32, 
            size: 600
        }, 
        scene
    )

    var gui = createGUI(); 

    scene.onBeforeRenderObservable.add(() => {
        // gui.linkWithMesh(camera);
        gui.position = new BABYLON.Vector3(0,0,camera.radius);
    })

    camera.attachControl(canvas, true);
    camera.layerMask = 2; 
    gui.layer.layerMask = 2; 
    // const vrHelper = scene.createDefaultVRExperience(); 
 
    // scene.actionManager = new BABYLON.ActionManager(scene);

    // scene.actionManager.registerAction(
    //     new BABYLON.ExecuteCodeAction({
    //         trigger: BABYLON.ActionManager.OnKeyDownTrigger, 
    //         parameter: 's'
    //     }, 
    //     function () { vrHelper.enterVR();}
    //     ));

    // scene.actionManager.registerAction(
    //     new BABYLON.ExecuteCodeAction({
    //         trigger: BABYLON.ActionManager.OnKeyDownTrigger, 
    //         parameter: 'e'
    //     }, 
    //     function() { vrHelper.exitVR(); }
    //     ));

    const music = new BABYLON.Sound("Music", "../media/gods_love.mp3", scene, null, {
        loop: true, 
        autoplay: true,
    });
    // // sets target on the center
    // camera.setTarget(BABYLON.Vector3.Zero());
    // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
        diameter: 2,
        segments: 32
    }, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    const xr = await scene.createDefaultXRExperienceAsync({
    });
    return scene;
};
window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    scene.then(returnedScene => { sceneToRender = returnedScene; });

});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

function createGUI() {
    let guiPanel = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("menu");
    let button1 = BABYLON.GUI.Button.CreateSimpleButton("button", "Click here...");
    button1.width = "150px";
    button1.height = "50px";
    button1.color = "white";
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        console.log("button works!!!")
    })
    guiPanel.addControl(button1);
    return guiPanel; 
}