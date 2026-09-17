import { NumberInput } from './components/NumberInput'
import { Spinner } from './components/Spinner'
import type { ReactNode } from 'react'
import { Checkbox, Radio } from './components/Choice'
import { Dropdown } from './components/Dropdown'
import { TextInput } from './components/TextInput'
import { PixelScale } from './components/PixelScale'

function Specimen({ title, scale, width, height, children }: { title: string; scale: number; width: number; height: number; children: ReactNode }) {
  return <article className="sample-card"><h3>{title}</h3><div className="sample-stage" role="img" aria-label={title}>
    <PixelScale scale={scale} width={width} height={height}><div inert style={{ width, height, position: 'relative', background: '#c0c0c0' }}>{children}</div></PixelScale>
  </div></article>
}

export function ChoiceSpecimens({ scale, radio = false }: { scale: number; radio?: boolean }) {
  const Control = radio ? Radio : Checkbox
  return [false, true].flatMap(labeled => [false, true].flatMap(disabled => [false, true].map(checked => {
    const title = `${disabled ? 'Disabled' : 'Default'} · ${checked ? 'Selected' : 'Unselected'}${labeled ? ' · Label' : ''}`
    return <Specimen key={title} title={title} scale={scale} width={labeled ? 116 : 40} height={38}>
      <Control aria-label={radio ? 'Radio' : 'Checkbox'} style={{ position: 'absolute', left: 12, top: 12 }} defaultChecked={checked} disabled={disabled}>{labeled ? 'Placeholder' : undefined}</Control>
    </Specimen>
  })))
}

export function TextInputSpecimens({ scale }: { scale: number }) {
  return [false, true].flatMap(disabled => [false, true].map(filled => {
    const title = `Text · ${disabled ? 'Disabled' : 'Default'}${filled ? ' filled' : ''}`
    return <Specimen key={title} title={title} scale={scale} width={184} height={60}>
      <span className="w95-native-text" style={{ position: 'absolute', left: 12, top: 9, color: disabled ? '#808080' : '#000' }}>Label:</span>
      <TextInput aria-label="Text field" style={{ position: 'absolute', left: 12, top: 27 }} width={160} defaultValue={filled ? 'placeholder' : ''} disabled={disabled} />
    </Specimen>
  }))
}

export function DropdownSpecimens({ scale, arrowOnly = false }: { scale: number; arrowOnly?: boolean }) {
  return [false, true].flatMap(disabled => (arrowOnly ? [false] : [false, true]).map(filled => {
    const title = arrowOnly ? disabled ? 'Disabled arrow' : 'Active arrow' : `Dropdown · ${disabled ? 'Disabled' : 'Default'}${filled ? ' filled' : ''}`
    return <Specimen key={title} title={title} scale={scale} width={arrowOnly ? 40 : 184} height={arrowOnly ? 40 : 60}>
      {!arrowOnly && <span className="w95-native-text" style={{ position: 'absolute', left: 12, top: 9, color: disabled ? '#808080' : '#000' }}>Label:</span>}
      <div style={{ position: 'absolute', left: 12, top: arrowOnly ? 12 : 27 }}>
        <Dropdown label={title} options={[filled ? 'placeholder' : '']} value={0} onChange={() => {}} disabled={disabled} arrowOnly={arrowOnly} height={arrowOnly ? 16 : 22} />
      </div>
    </Specimen>
  }))
}

export function NumberSpecimens({ scale }: { scale: number }) {
  return [false, true].flatMap(disabled => [false, true].map(filled => <Specimen key={`${disabled}-${filled}`} title={`${disabled ? 'Disabled' : 'Default'}${filled ? ' filled' : ''}`} scale={scale} width={80} height={60}>
    <span className="w95-native-text" style={{ position: 'absolute', left: 12, top: 9, color: disabled ? '#808080' : '#000' }}>Label:</span>
    <NumberInput aria-label="Number" containerStyle={{ position: 'absolute', left: 12, top: 27 }} width={48} value={filled ? '000' : ''} onChange={() => {}} disabled={disabled} />
  </Specimen>))
}
export function SpinnerSpecimens({ scale }: { scale: number }) {
  return [false, true].flatMap(upDisabled => [false, true].map(downDisabled => <Specimen key={`${upDisabled}-${downDisabled}`} title={`${upDisabled ? 'Disabled' : 'Active'} / ${downDisabled ? 'Disabled' : 'Active'}`} scale={scale} width={40} height={40}>
    <Spinner height={16} style={{ position: 'absolute', left: 12, top: 12 }} upDisabled={upDisabled} downDisabled={downDisabled} onStep={() => {}} />
  </Specimen>))
}
