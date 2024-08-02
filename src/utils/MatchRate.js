import React from 'react';
import { useSpring, animated } from 'react-spring';
import './MatchRate.css';

function interpolateColor(value, color1, color2) {
    const ratio = value / 100;
    const hex = (color) => {
        const int = parseInt(color.substring(1), 16);
        return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
    };

    const hex1 = hex(color1);
    const hex2 = hex(color2);
    const hexInterpolated = [
        Math.round(hex1[0] * (1 - ratio) + hex2[0] * ratio),
        Math.round(hex1[1] * (1 - ratio) + hex2[1] * ratio),
        Math.round(hex1[2] * (1 - ratio) + hex2[2] * ratio),
    ];

    return `#${hexInterpolated
        .map((val) => val.toString(16).padStart(2, '0'))
        .join('')}`;
}

const getColor = (score) => {
    if (score < 20) return interpolateColor(score, '#ff4c4c', '#ff884c'); // Red to Orange
    if (score < 40) return interpolateColor(score - 20, '#ff884c', '#ffc04c'); // Orange to Yellow-Orange
    if (score < 60) return interpolateColor(score - 40, '#ffc04c', '#c0ff4c'); // Yellow-Orange to Yellow-Green
    if (score < 80) return interpolateColor(score - 60, '#c0ff4c', '#3dd93d'); // Yellow-Green to Green
    return '#3dd93d'; // Bright Green
};

const getDescription = (score) => {
    if (score < 20) return 'Not good';
    if (score < 40) return 'Fair';
    if (score < 60) return 'Good';
    if (score < 80) return 'Great';
    return 'Excellent';
};

const MatchRate = ({ score }) => {
    // Animation for the score value
    const numberProps = useSpring({
        from: { number: 0 },
        number: score,
        delay: 200,
        config: { duration: 1500, easing: t => t },
    });

    // Animation for the circle's stroke-dashoffset
    const circleProps = useSpring({
        from: { strokeDashoffset: 125.5 },
        strokeDashoffset: 125.5 - (125.5 * score) / 100,
        config: { duration: 1500, easing: t => t },
    });

    return (
        <div className="match-rate">
            <label className='mb-5 text-lg text-normalText'>MATCH SCORE</label>
            <svg width="125" height="125" viewBox="0 0 50 50">
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="#e6e6e6"
                    strokeWidth="5"
                    fill="none"
                />
                <animated.circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke={getColor(score)}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray="125.5"
                    strokeDashoffset={circleProps.strokeDashoffset.to(val => val)}
                    strokeLinecap="round"
                    transform="rotate(-90 25 25)"
                />
                <text x="25" y="25" textAnchor="middle" dy="0.3em" fontSize="10" fill={getColor(score)}>
                    <animated.tspan>
                        {numberProps.number.to(val => Math.floor(val) + '%')}
                    </animated.tspan>
                </text>
            </svg>
            <p className='mt-5 text-base text-normalText'>{getDescription(score)}</p>
        </div>
    );
};

export default MatchRate;
