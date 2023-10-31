module.exports = {
    compareTime: (time) => {
        const dataStart = new Date(time);
        const now = new Date();
        const diffMillis = now - dataStart;

        function calcDiffYear() {
            const years = now.getFullYear() - dataStart.getFullYear();
            if (now.getMonth() < dataStart.getMonth() || (now.getMonth() === dataStart.getMonth() && now.getDate() < dataStart.getDate())) {
                return years - 1;
            }
            return years;
        }

        const diffSecond = Math.floor(diffMillis / 1000);

        if (diffSecond < 60) {
            return `${diffSecond} ${diffSecond > 1 ? 'segundo' : 'segundos'}`;
        } else {
            const diffMinute = Math.floor(diffSecond / 60);

            if (diffMinute < 60) {
                return `${diffMinute} ${diffMinute > 1 ? 'minutos' : 'minuto'}`;
            } else {
                const diffHour = Math.floor(diffMinute / 60);

                if (diffHour < 24) {
                    return `${diffHour} ${diffHour > 1 ? 'horas' : 'hora'}`;
                } else {
                    const diffDay = Math.floor(diffHour / 24);

                    if (diffDay < 30) {
                        return `${diffDay} ${diffDay > 1 ? 'dias' : 'dia'}`;
                    } else {
                        const diffMonth = Math.floor(diffDay / 30);

                        if (diffMonth < 12) {
                            return `${diffMonth} ${diffMonth > 1 ? 'meses' : 'mês'}`;
                        } else {
                            return `${calcDiffYear()} ${calcDiffYear() > 1 ? 'anos': 'ano'}`;
                        }
                    }
                }
            }
        }
    }
}