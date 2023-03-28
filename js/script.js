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

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    // Parameters: alpha, beta, radius, target position, scene
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    // // Positions the camera overwriting alpha, beta, radius
    // camera.setPosition(new BABYLON.Vector3(0, 0, 20));
    // // Set the mouse wheel delta percentage or how fast is the camera zooming
    // camera.wheelDeltaPercentage = 0.01
    // // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    camera.inputs.attached.mousewheel.detachControl(canvas);

    var dome = new BABYLON.PhotoDome(
        "testdome", 
        "../media/test.jpg", 
        {
            resolution: 32, 
            size: 600
        }, 
        scene
    )
    const vrHelper = scene.createDefaultVRExperience(); 

    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnKeyDownTrigger, 
            parameter: 's'
        }, 
        function () { vrHelper.enterVR();}
        ));

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction({
            trigger: BABYLON.ActionManager.OnKeyDownTrigger, 
            parameter: 'e'
        }, 
        function() { vrHelper.exitVR(); }
        ));
    return scene;
    // // sets target on the center
    // camera.setTarget(BABYLON.Vector3.Zero());
    // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    // var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    // // Default intensity is 1. Let's dim the light a small amount
    // light.intensity = 0.7;
    // // Our built-in 'sphere' shape.
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    //     diameter: 2,
    //     segments: 32
    // }, scene);
    // // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;
    // // Our built-in 'ground' shape.
    // var ground = BABYLON.MeshBuilder.CreateGround("ground", {
    //     width: 6,
    //     height: 6
    // }, scene);

    // const xr = await scene.createDefaultXRExperienceAsync({
    //     floorMeshes: [ground]
    // });
    // return scene;
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