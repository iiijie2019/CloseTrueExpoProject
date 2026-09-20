import Svg, { Circle, Ellipse, Path, Rect, Text as SvgText, G } from 'react-native-svg';

export function GroveIllustration({ size = 250 }: { size?: number }) {
  return <Svg width={size} height={size * 0.85} viewBox="0 0 280 238" aria-hidden={true}>
    <Circle cx={146} cy={116} r={103} fill="#E8F0DA" opacity={0.7}/>
    <Circle cx={228} cy={56} r={21} fill="#F8D8A7"/>
    <Ellipse cx={146} cy={219} rx={87} ry={9} fill="#B6C9AB" opacity={0.2}/>
    <Path d="M146 211C139 181 146 128 152 67M145 174C121 151 100 131 82 109M149 145C177 129 195 113 208 95M150 111C134 91 124 81 108 70" stroke="#6C8F68" strokeWidth={3} fill="none" strokeLinecap="round"/>
    <Path d="M145 181C109 185 96 166 93 146C119 145 140 155 145 181Z" fill="#8FAF87"/>
    <Path d="M145 161C168 158 185 145 191 127C164 124 149 138 145 161Z" fill="#A5C397"/>
    <Path d="M151 103C161 80 160 61 149 43C133 62 135 87 151 103Z" fill="#658A64"/>
    <Path d="M112 83C92 89 75 81 68 64C90 57 105 65 112 83Z" fill="#B6CBA0"/>
    <G transform="rotate(-8 64 109)"><Rect x={18} y={88} width={88} height={38} rx={14} fill="#FFFDF6"/><SvgText x={62} y={113} fontSize={17} fontFamily="Georgia" fill="#527555" textAnchor="middle">active</SvgText></G>
    <G transform="rotate(6 217 101)"><Rect x={170} y={83} width={98} height={38} rx={14} fill="#FFFDF6"/><SvgText x={219} y={108} fontSize={17} fontFamily="Georgia" fill="#527555" textAnchor="middle">action</SvgText></G>
    <Rect x={110} y={182} width={71} height={38} rx={14} fill="#4D7959"/><SvgText x={145} y={208} fontSize={22} fontFamily="Georgia" fill="#FFFDF6" textAnchor="middle">act</SvgText>
    <Path d="M36 166L39 173L46 176L39 179L36 186L33 179L26 176L33 173Z" fill="#DCB777"/>
    <Circle cx={243} cy={162} r={4} fill="#A7BBA0"/>
    <Circle cx={57} cy={42} r={3} fill="#D2C9AC"/>
  </Svg>;
}

export function WordIllustration() {
  return <Svg width={130} height={104} viewBox="0 0 160 125" aria-hidden={true}>
    <Circle cx={96} cy={60} r={49} fill="#F3D7B6" opacity={0.7}/>
    <G transform="rotate(-12 65 60)"><Rect x={24} y={25} width={69} height={85} rx={13} fill="#D0AC87" opacity={0.16}/><Rect x={21} y={20} width={69} height={85} rx={13} fill="#FFFCF6"/><SvgText x={34} y={58} fontSize={26} fontFamily="Georgia" fill="#AB784D">Aa</SvgText><Path d="M35 74H74M35 83H61" stroke="#DFCDB8" strokeWidth={3} strokeLinecap="round"/></G>
    <G transform="rotate(9 112 74)"><Rect x={77} y={55} width={62} height={45} rx={13} fill="#C18557"/><SvgText x={108} y={85} fontSize={22} fontFamily="Georgia" fill="#FFF9EE" textAnchor="middle">n.</SvgText></G>
    <Path d="M131 18L134 25L141 28L134 31L131 38L128 31L121 28L128 25Z" fill="#B99B6B"/>
  </Svg>;
}
