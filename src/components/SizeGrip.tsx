const rows = ['..............w.', '.............w..', '............wg..', '...........wgg..', '..........wgg...', '.........wgg.w..', '........wgg.wg..', '.......wgg.wgg..', '......wgg.wgg...', '.....wgg.wgg.w..', '....wgg.wgg.wg..', '...wgg.wgg.wgg..', '..wgg.wgg.wgg...', 'ww..............', '................']
export function SizeGrip() {
  return <svg width={16} height={15} aria-hidden="true" style={{ position: 'absolute', right: 3, bottom: 3, background: '#c0c0c0', pointerEvents: 'none' }} shapeRendering="crispEdges">{['w', 'g'].map(color => <path key={color} fill={color === 'w' ? '#fff' : '#808080'} d={rows.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === color ? [`M${x} ${y}h1v1h-1z`] : [])).join('')} />)}</svg>
}
