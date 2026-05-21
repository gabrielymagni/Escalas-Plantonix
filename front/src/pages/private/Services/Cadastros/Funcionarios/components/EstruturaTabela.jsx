import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const EstruturaTabela = ({ rows, columns }) => {

    return (
        <div>
            <Paper sx={{ width: "100%", borderRadius: 3 }}>
                <TableContainer sx={{ border: '3px solid #62acb5', borderRadius: 3, bgcolor: '#fff' }}>
                    <Table sx={{tableLayout: "fixed", width: "100%"}} >

                        <TableHead>
                            <TableRow sx={{ borderBottom: "1px solid #1b1464" }}>
                                {columns.map((column) => (
                                    <TableCell key={column.id} sx={{
                                        width: column.width,
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
                        </TableHead>

                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow hover key={index} sx={{ borderColor: "#1b1464" }}>
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
                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>
        </div >
    )
}

export default EstruturaTabela


export const sxTableCell = (column) => ({
    borderColor: "#1b1464",
    py: 0.5, px: 1,
    fontWeight: 'bold',
    width: column.width,
    textAlign: 'center'
})