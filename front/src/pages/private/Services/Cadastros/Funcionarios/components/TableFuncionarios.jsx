import { Paper, Table, TableCell, TableContainer, TableRow } from "@mui/material";

const TableFuncionarios = ({ rows, columns }) => {

    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, }}>
                <TableContainer sx={{ border: '3px solid #62acb5', borderRadius: 3, bgcolor: '#fff' }}>
                    <Table stickyHeader  >

                        <TableRow sx={{ borderBottom: "1px solid #1b1464", }}>
                            {columns.map((column) => (
                                <TableCell key={column.id} sx={{
                                    minWidth: column.minWidth,
                                    color: '#1b1464',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    borderBottom: "1px solid #1b1464",
                                }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>

                        {rows.map((row, index) => (
                            <TableRow hover key={index} sx={{ borderColor: "#1b1464" }} >
                                {columns.map((column) => {

                                    if (column.render) {
                                        return (
                                            <TableCell key={column.id} sx={sxTableCell(column)}>
                                                {column.render(row)}
                                            </TableCell>
                                        );
                                    }

                                    const value = row[column.id];

                                    return (
                                        <TableCell key={column.id} sx={sxTableCell(column)}>
                                            {value}
                                        </TableCell>
                                    );

                                })}
                            </TableRow>
                        ))}

                    </Table>
                </TableContainer>
            </Paper>
        </div >
    )
}

export default TableFuncionarios


export const sxTableCell = (column) => ({
    borderColor: "#1b1464",
    py: 0.5, px: 1,
    fontWeight: 'bold',
    minWidth: column.minWidth,
    textAlign: 'center'
})