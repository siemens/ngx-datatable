import { adjustColumnWidths, forceFillColumnWidths } from './math';

describe('Math function', () => {
  describe('forceFillColumnWidths', () => {
    describe('when column expanded', () => {
      it('should resize only columns right to the resized column', () => {
        const columns = [
          { prop: 'id', width: 250, canAutoResize: true },
          { prop: 'name', width: 400, canAutoResize: true },
          { prop: 'email', width: 250, canAutoResize: true }
        ];

        forceFillColumnWidths(columns, 750, 1, true); // Column 2 expanded from 250 to 400

        expect(columns[0].width).toBe(250); // Not changed
        expect(columns[1].width).toBe(400);
        expect(columns[2].width).toBe(250);
      });
    });

    describe('when column compressed', () => {
      it('should resize only columns right to the resized column', () => {
        const columns = [
          { prop: 'id', width: 250, canAutoResize: true },
          { prop: 'name', width: 180, canAutoResize: true },
          { prop: 'email', width: 250, canAutoResize: true }
        ];

        forceFillColumnWidths(columns, 750, 1, true); // Column 2 contracted from 250 to 180

        expect(columns[0].width).toBe(250); // Not changed
        expect(columns[1].width).toBe(180);
        expect(columns[2].width).toBe(320);
      });
    });
  });

  describe('adjustColumnWidths', () => {
    describe('flex mode', () => {
      it('should not go overflow/underflow compared to given max width', () => {
        const cols = {
          center: [
            { prop: 'id1', width: 287, maxWidth: undefined, minWidth: 175, flexGrow: 2, canAutoResize: true },
            { prop: 'id2', width: 215, maxWidth: undefined, minWidth: 200, flexGrow: 1.5, canAutoResize: true },
            { prop: 'id3', width: 287, maxWidth: undefined, minWidth: 150, flexGrow: 2, canAutoResize: true },
            { prop: 'id4', width: 175, maxWidth: undefined, minWidth: 175, flexGrow: 1, canAutoResize: true },
            { prop: 'id5', width: 143, maxWidth: undefined, minWidth: 120, flexGrow: 1, canAutoResize: true }
          ]
        };

        const givenTableWidth = 1180;

        adjustColumnWidths(cols.center, givenTableWidth);

        const totalAdjustedColumnWidths = cols.center.map(c => c.width).reduce((p, c) => p + c, 0)
        expect(totalAdjustedColumnWidths).toBeCloseTo(givenTableWidth, 0.001);
      });
    });
  });
});
