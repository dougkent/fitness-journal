export class JournalEntryIdService {
    public getId = (date: Date): string => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return year + '-' + this.getTwoDigitNumber(month) + '-' + this.getTwoDigitNumber(day);
    }

    private getTwoDigitNumber = (num: number): string => {
        if (num < 10) {
            return '0' + num.toString();
        } else {
            return num.toString();
        }
    };
}