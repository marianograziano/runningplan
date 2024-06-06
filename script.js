function generateICal() {
    const input = document.getElementById('scheduleInput').value;
    const lines = input.split('\n');
    const events = [];
    let currentWeek = '';

    const getDateForWeekday = (week, day) => {
        const [startDay, endDay] = week.split(' - ').map(d => parseInt(d));
        const baseDate = new Date(2024, 5, startDay); // June 2024
        baseDate.setDate(baseDate.getDate() + day);
        return baseDate.toISOString().split('T')[0].replace(/-/g, '');
    };

    const weekdays = {
        'LUNES': 0,
        'MARTES': 1,
        'MIERCOLES': 2,
        'JUEVES': 3,
        'VIERNES': 4,
        'SABADO': 5,
        'DOMINGO': 6
    };

    lines.forEach(line => {
        if (line.startsWith('S ')) {
            currentWeek = line.split(' ')[1].split('\t')[0];
        } else if (line) {
            const parts = line.split('\t');
            if (parts.length > 1 && weekdays.hasOwnProperty(parts[0])) {
                const date = getDateForWeekday(currentWeek, weekdays[parts[0]]);
                const description = parts.slice(1).filter(p => p).join(' - ');
                events.push({
                    date,
                    description
                });
            }
        }
    });

    const generateICalContent = events => {
        let ical = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Training Schedule//EN\n';
        events.forEach(event => {
            ical += `BEGIN:VEVENT\nDTSTART:${event.date}\nSUMMARY:${event.description}\nEND:VEVENT\n`;
        });
        ical += 'END:VCALENDAR';
        return ical;
    };

    const icalContent = generateICalContent(events);
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'training_schedule.ics';
    downloadLink.style.display = 'block';
    downloadLink.textContent = 'Download iCal';
}
