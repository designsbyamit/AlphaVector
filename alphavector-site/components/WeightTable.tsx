// A weight breakdown drawn as plain bars, one row per component.
export function WeightTable({ title, signal, rows }: { title: string; signal: 'strength' | 'passion' | 'market'; rows: Array<[string, number]> }) {
  const fill = signal === 'strength' ? 'bg-strength-fill' : signal === 'passion' ? 'bg-passion-fill' : 'bg-market-fill'
  const text = signal === 'strength' ? 'text-strength' : signal === 'passion' ? 'text-passion' : 'text-market'
  return (
    <div>
      <h4 className={`font-display text-[1.15rem] font-bold ${text}`}>{title}</h4>
      <table className="mt-3 w-full text-[1rem]">
        <tbody>
          {rows.map(([name, w]) => (
            <tr key={name} className="border-t border-rule">
              <th scope="row" className="py-2 pr-3 text-left font-normal">{name}</th>
              <td className="w-[40%] py-2">
                <div className="h-2.5 bg-paper-deep" role="img" aria-label={`${Math.round(w * 100)} percent`}>
                  <div className={`h-full ${fill}`} style={{ width: `${w * 250}%`, maxWidth: '100%' }} />
                </div>
              </td>
              <td className="w-12 py-2 pl-3 text-right font-display font-semibold tabular-nums">{Math.round(w * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
