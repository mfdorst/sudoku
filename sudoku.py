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
                print('┠─────────┼─────────┼─────────╂─────────┼─────────┼─────────╂─────────┼─────────┼─────────┨')
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


board = Board()
board.print()
