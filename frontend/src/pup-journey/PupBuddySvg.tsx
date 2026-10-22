import React from 'react';
import {
  COLOR_BLUSH,
  COLOR_COLLAR,
  COLOR_BODY,
  COLOR_LIGHT,
  COLOR_DARK,
  COLOR_STROKE,
  EYE_Y,
  PUPPET_W,
  PUPPET_R,
  PATHS,
  LEGS,
  POSES,
  legPawPath,
  solveKinematics,
} from './pupConstants';

const strokeBase: React.SVGProps<SVGPathElement> = {
  stroke: COLOR_STROKE,
  strokeWidth: 3.4,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

const strokeNone: React.SVGProps<SVGPathElement> = {
  ...strokeBase,
  fill: 'none',
};

interface LegProps {
  part: string;
  d: string;
  len: number;
  fill: string;
  transform?: string;
  opacity?: number;
}

const LegGroup: React.FC<LegProps> = ({ part, d, len, fill, transform, opacity }) => (
  <g data-p={part} transform={transform} opacity={opacity}>
    <path d={`${d}Z`} fill={fill} />
    <path d={d} {...strokeNone} />
    <path d={legPawPath(len)} {...strokeNone} strokeWidth={2.4} />
  </g>
);

const EyesPupils: React.FC = () => (
  <React.Fragment>
    <ellipse cx={194} cy={EYE_Y} rx={7.4} ry={8.6} fill={COLOR_STROKE} />
    <ellipse cx={230} cy={EYE_Y} rx={7.4} ry={8.6} fill={COLOR_STROKE} />
    <circle cx={196.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
    <circle cx={232.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
    <circle cx={192} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
    <circle cx={228} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
  </React.Fragment>
);

interface PupBuddySvgProps {
  pose?: string;
  facing?: 'right' | 'left' | number;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}

export const PupBuddySvg: React.FC<PupBuddySvgProps> = ({
  pose = 'sit',
  facing = 'right',
  className,
  label,
  style,
}) => {
  const currentPose = POSES[pose] || POSES.sit;
  const k = solveKinematics(currentPose);
  const facingFlip = facing === 'left' || facing === -1 ? `translate(${PUPPET_W} 0) scale(-1 1)` : undefined;

  return (
    <svg
      viewBox={`0 0 ${PUPPET_W} ${PUPPET_R}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
      focusable="false"
    >
      <g data-p="root" transform={facingFlip}>
        <ellipse
          data-p="shadow"
          cx={PATHS.shadow.cx}
          cy={PATHS.shadow.cy}
          rx={PATHS.shadow.rx}
          ry={PATHS.shadow.ry}
          fill={COLOR_STROKE}
          opacity={k.shadowOpacity}
          transform={k.shadow}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        <g data-p="body" transform={k.body} opacity={k.side}>
          <LegGroup
            part="bf"
            d={LEGS.backFar}
            len={228 - 192}
            fill={COLOR_DARK}
            transform={k.bf}
            opacity={k.backLegs}
          />
          <LegGroup
            part="ff"
            d={LEGS.frontFar}
            len={228 - 192}
            fill={COLOR_DARK}
            transform={k.ff}
          />

          <g data-p="tail" transform={k.tail}>
            <path d={PATHS.tailStem} {...strokeNone} strokeWidth={9} />
            <path d={PATHS.tailStem} stroke={COLOR_BODY} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={PATHS.tail} fill={COLOR_BODY} {...strokeBase} />
          </g>

          <LegGroup
            part="bn"
            d={LEGS.back}
            len={228 - 194}
            fill={COLOR_BODY}
            transform={k.bn}
            opacity={k.backLegs}
          />

          <path d={PATHS.body} fill={COLOR_BODY} {...strokeBase} />
          <path d={PATHS.chest} fill={COLOR_BODY} {...strokeBase} />

          <LegGroup
            part="fn"
            d={LEGS.front}
            len={228 - 194}
            fill={COLOR_BODY}
            transform={k.fn}
          />
        </g>

        <g data-p="haunch" opacity={k.haunchOpacity} transform={k.haunch}>
          <path d={PATHS.haunch} fill={COLOR_BODY} {...strokeBase} />
          <path d={PATHS.haunchPaw} fill={COLOR_BODY} {...strokeBase} />
          <path d="M132 222v5M139 222v5" {...strokeNone} strokeWidth={2.4} />
        </g>

        <g data-p="head" transform={k.head}>
          <path d={PATHS.collar} fill={COLOR_COLLAR} {...strokeBase} strokeWidth={3} />
          <path d={PATHS.tag} fill={COLOR_LIGHT} {...strokeBase} strokeWidth={2.4} />
          <path data-p="earL" d={PATHS.earL} fill={COLOR_DARK} {...strokeBase} transform={k.earL} />
          <path data-p="earR" d={PATHS.earR} fill={COLOR_DARK} {...strokeBase} transform={k.earR} />
          <path d={PATHS.head} fill={COLOR_BODY} {...strokeBase} />
          <path d={PATHS.topknot} fill={COLOR_BODY} {...strokeBase} strokeWidth={3} />
          <path d={PATHS.muzzle} fill={COLOR_LIGHT} />
          <circle cx={181} cy={116} r={7} fill={COLOR_BLUSH} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={COLOR_BLUSH} opacity={0.85} />

          <g data-p="eyes" transform={k.eyes}>
            <g data-p="open" opacity={k.openEyes}>
              <g data-p="blink" transform={k.blink}>
                <EyesPupils />
              </g>
            </g>
            <path
              data-p="happy"
              d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
              {...strokeNone}
              opacity={k.happyEyes}
            />
            <path
              data-p="shut"
              d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
              {...strokeNone}
              opacity={k.shutEyes}
            />
          </g>

          <path d={PATHS.nose} fill={COLOR_STROKE} />
          <path d={PATHS.mouth} {...strokeNone} strokeWidth={3} />
          <path
            data-p="tongue"
            d={PATHS.tongue}
            fill="#e98c8c"
            stroke={COLOR_STROKE}
            strokeWidth={2.2}
            strokeLinejoin="round"
            opacity={k.tongue}
          />
          <g data-p="mouth" opacity={k.mouth}>
            <path d={PATHS.mouthOpen} fill="#6b2a1c" {...strokeBase} strokeWidth={2.6} />
            <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
          </g>
        </g>

        <g data-p="ledge" opacity={k.ledge}>
          <path d={PATHS.ledgePaws} fill={COLOR_BODY} {...strokeBase} />
          <path d={PATHS.ledgeToes} {...strokeNone} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  );
};
