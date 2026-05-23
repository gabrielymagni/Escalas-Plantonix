import EstruturaTabela from '../../Funcionarios/components/EstruturaTabela'

const TabelaRegras = ({ rows, columns }) => {
    return (
        <div>
            <EstruturaTabela rows={rows} columns={columns} />
        </div>
    )
}

export default TabelaRegras
