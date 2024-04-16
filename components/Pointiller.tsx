import React, {useRef, useEffect} from 'react';
import {Image as RNImage} from 'react-native';
import Canvas, {
    Image as CanvasImage,
    CanvasRenderingContext2D,
} from 'react-native-canvas';

const PointillismComponent = () => {
    const canvasRef = useRef<any>();
    const imageRef = useRef<any>();

    useEffect(() => {
        if (
            canvasRef.current &&
            imageRef.current &&
            imageRef.current.props &&
            imageRef.current.props.source
        ) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const image = new CanvasImage(canvas);
            image.src = imageRef.current.props.source.uri;
            image.addEventListener('load', () => {
                context.drawImage(image, 0, 0, image.width, image.height);
                createPointillism(context, image);
            });
        }
        return () => {};
    }, [canvasRef, imageRef]);

    const createPointillism = async (
        context: CanvasRenderingContext2D,
        image: any,
    ) => {
        const imageData = await context.getImageData(
            0,
            0,
            image.width,
            image.height,
        );
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const alpha = data[i + 3] / 255;
            const x = (i / 4) % image.width;
            const y = Math.floor(i / 4 / image.width);
            context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            context.fillRect(x, y, 1, 1);
        }
    };

    return (
        <>
            <Canvas ref={canvasRef} />
            <RNImage
                ref={imageRef}
                source={require('../assets/test.jpg')}
                onLoadEnd={() => {}}
                style={{display: 'none'}}
            />
        </>
    );
};

export default PointillismComponent;
