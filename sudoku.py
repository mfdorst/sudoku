#!/usr/bin/env python


class Cell:
    def __init__(self, value=None, possibilities=[]):
        self.value = value
        self.possibilities = []


class Board:
    def __init__(self):
        self.cells = [[Cell() for _ in range(9)] for _ in range(9)]

    def print(self):
        separators = [
            '┏━━━━━━━━━┯━━━━━━━━━┯━━━━━━━━━┳━━━━━━━━━┯━━━━━━━━━┯━━━━━━━━━┳━━━━━━━━━┯━━━━━━━━━┯━━━━━━━━━┓',
            '┣━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━╋━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━╋━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━┫',
            '┣━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━╋━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━╋━━━━━━━━━┿━━━━━━━━━┿━━━━━━━━━┫',

        ]
        for row_i, row in enumerate(self.cells):
            if row_i % 3 == 0:
                print(separators[row_i // 3])
            else:
                print(
                    '┠─────────┼─────────┼─────────╂─────────┼─────────┼─────────╂─────────┼─────────┼─────────┨')
            for cell_row in range(3):
                print('┃  ', end='')
                for cell_i, cell in enumerate(row):
                    for i in range(3):
                        position = cell_row * 3 + i
                        possibility = position if position in cell.possibilities else None
                        char = cell.value if cell.value else possibility if possibility else ' '
                        print(f'{char} ', end='')
                    if cell_i == 8:
                        print(' ┃')
                    elif cell_i % 3 == 2:
                        print(' ┃  ', end='')
                    else:
                        print(' │  ', end='')

        print('┗━━━━━━━━━┷━━━━━━━━━┷━━━━━━━━━┻━━━━━━━━━┷━━━━━━━━━┷━━━━━━━━━┻━━━━━━━━━┷━━━━━━━━━┷━━━━━━━━━┛')

    def load(self, board):
        """Loads a sudoku board from a 2D array of numbers. Empty spaces should be represented by None."""
        for from_row, to_row in zip(board, self.cells):
            for from_cell, to_cell in zip(from_row, to_row):
                to_cell.value = from_cell


board = Board()
board.load([
    [1, 2, 3, None, None, 6, 7, None, None],
    [None, 1, 2, 3, None, None, 6, 7, None],
    [None, None, 1, 2, 3, None, None, 6, 7],
    [7, None, None, 1, 2, 3, None, None, 6],
    [6, 7, None, None, 1, 2, 3, None, None],
    [None, 6, 7, None, None, 1, 2, 3, None],
    [3, None, None, 6, 7, None, None, 1, 2],
    [2, 3, None, None, 6, 7, None, None, 1],
])
board.print()
