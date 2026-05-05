import React, { useRef, useEffect } from 'react';

export const WebGLTest: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('❌ WebGL non supporté');
      return;
    }

    console.log('✅ WebGL supporté');
    console.log('Vendor:', gl.getParameter(gl.VENDOR));
    console.log('Renderer:', gl.getParameter(gl.RENDERER));
    console.log('Version:', gl.getParameter(gl.VERSION));

    // Test de rendu simple
    gl.clearColor(0.2, 0.4, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Dessiner un triangle simple
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1, 0, 0, 1);
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      0, 0.5,
      -0.5, -0.5,
      0.5, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    console.log('✅ Triangle WebGL rendu avec succès');

  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Test WebGL</h3>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className="border border-gray-200"
        style={{ backgroundColor: '#f0f0f0' }}
      />
      <p className="mt-2 text-sm text-gray-600">
        Si vous voyez un triangle rouge, WebGL fonctionne.
      </p>
    </div>
  );
};