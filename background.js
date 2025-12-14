
// Constants & Configuration
const PARTICLE_COUNT = 3000;
const CONNECTOR_COUNT = 150;
const CONNECTION_DISTANCE = 3.5;
const ORB_COUNT = 4;

const DARK_COLORS = {
    background: 0x050505,
    particle: 0x88ccff,
    connector: 0xff00aa,
    line: 0xaa00ff,
    orb: [0x00ffff, 0xff00ff, 0x8800ff, 0xff0088]
};

const LIGHT_COLORS = {
    background: 0xffffff,
    particle: 0x0066cc,
    connector: 0xcc0088,
    line: 0x8800cc,
    orb: [0x00cccc, 0xcc00cc, 0x6600cc, 0xcc0066]
};

let scene, camera, renderer;
let particleSystem, connectedSystem, linesSystem;
let particlesData = [];
let connectorVelocities = [];
let currentColors = DARK_COLORS; // Default to dark

function initBackground() {
    const container = document.getElementById('canvas-container');

    // Check theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    currentColors = isDark ? DARK_COLORS : LIGHT_COLORS;

    // Scene setup
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(currentColors.background); // We use CSS for BG color to allow transparency

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // --- Particle Field (Dust) ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPos = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        particlesPos[i * 3] = x;
        particlesPos[i * 3 + 1] = y;
        particlesPos[i * 3 + 2] = z;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: currentColors.particle,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // --- Connected Particles ---
    const connectedGeometry = new THREE.BufferGeometry();
    const connectedPos = new Float32Array(CONNECTOR_COUNT * 3);

    for (let i = 0; i < CONNECTOR_COUNT; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;

        connectedPos[i * 3] = x;
        connectedPos[i * 3 + 1] = y;
        connectedPos[i * 3 + 2] = z;

        particlesData.push({ x, y, z });

        // Velocities
        connectorVelocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    connectedGeometry.setAttribute('position', new THREE.BufferAttribute(connectedPos, 3));
    const connectedMaterial = new THREE.PointsMaterial({
        color: currentColors.connector,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    connectedSystem = new THREE.Points(connectedGeometry, connectedMaterial);
    scene.add(connectedSystem);

    // --- Lines ---
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: currentColors.line,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    linesSystem = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesSystem);

    // Events
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateTheme(isDark) {
    currentColors = isDark ? DARK_COLORS : LIGHT_COLORS;
    if (particleSystem) particleSystem.material.color.setHex(currentColors.particle);
    if (connectedSystem) connectedSystem.material.color.setHex(currentColors.connector);
    if (linesSystem) linesSystem.material.color.setHex(currentColors.line);
    // scene.background = new THREE.Color(currentColors.background);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate Dust Field
    if (particleSystem) {
        particleSystem.rotation.x -= 0.0005;
        particleSystem.rotation.y -= 0.001;
    }

    // Update Connected Particles
    let linePositions = [];
    let positions = connectedSystem.geometry.attributes.position.array;

    for (let i = 0; i < CONNECTOR_COUNT; i++) {
        // Update Position
        particlesData[i].x += connectorVelocities[i].x;
        particlesData[i].y += connectorVelocities[i].y;
        particlesData[i].z += connectorVelocities[i].z;

        // Bounce
        const limit = 12;
        if (Math.abs(particlesData[i].x) > limit) connectorVelocities[i].x *= -1;
        if (Math.abs(particlesData[i].y) > limit) connectorVelocities[i].y *= -1;
        if (Math.abs(particlesData[i].z) > limit) connectorVelocities[i].z *= -1;

        // Update buffer
        positions[i * 3] = particlesData[i].x;
        positions[i * 3 + 1] = particlesData[i].y;
        positions[i * 3 + 2] = particlesData[i].z;

        // Check connections
        for (let j = i + 1; j < CONNECTOR_COUNT; j++) {
            const dx = particlesData[i].x - particlesData[j].x;
            const dy = particlesData[i].y - particlesData[j].y;
            const dz = particlesData[i].z - particlesData[j].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < CONNECTION_DISTANCE) {
                linePositions.push(
                    particlesData[i].x, particlesData[i].y, particlesData[i].z,
                    particlesData[j].x, particlesData[j].y, particlesData[j].z
                );
            }
        }
    }

    connectedSystem.geometry.attributes.position.needsUpdate = true;

    // Update Lines Geometry
    linesSystem.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    renderer.render(scene, camera);
}

// Export functions for script.js
window.initBackground = initBackground;
window.updateBackgroundTheme = updateTheme;
