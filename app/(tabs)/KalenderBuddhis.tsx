import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface CalendarProps {
  setActiveSection: (section: string) => void;
}

interface UposathaDay {
  date: number;
  type: 'gelap' | 'purnama';
  day: string;
}

interface ImportantDate {
  name: string;
  date: string;
  icon: string;
}

const BuddhistCalendar = ({ setActiveSection }: CalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = Januari

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

//   sementara, ntar gw buat CRUDnya di backend
  const uposathaData: { [key: number]: UposathaDay[] } = {
  0: [ // Januari
    { date: 19, type: 'gelap', day: 'Senin' },   // New Moon Jan 19
    { date: 3,  type: 'purnama', day: 'Sabtu' }  // Full Moon Jan 3
  ],
  1: [ // Februari
    { date: 17, type: 'gelap', day: 'Selasa' },  // New Moon Feb 17
    { date: 2,  type: 'purnama', day: 'Senin' }  // Full Moon Feb 2
  ],
  2: [ // Maret
    { date: 19, type: 'gelap', day: 'Kamis' },   // New Moon Mar 19
    { date: 3,  type: 'purnama', day: 'Selasa' } // Full Moon Mar 3
  ],
  3: [ // April
    { date: 17, type: 'gelap', day: 'Jumat' },   // New Moon Apr 17
    { date: 2,  type: 'purnama', day: 'Kamis' }  // Full Moon Apr 2
  ],
  4: [ // Mei
    { date: 17, type: 'gelap', day: 'Minggu' },  // New Moon May 17
    { date: 1,  type: 'purnama', day: 'Jumat' }  // Full Moon May 1
  ],
  5: [ // Juni
    { date: 15, type: 'gelap', day: 'Senin' },   // New Moon Jun 15
    { date: 30, type: 'purnama', day: 'Selasa' } // Full Moon Jun 30
  ],
  6: [ // Juli
    { date: 14, type: 'gelap', day: 'Selasa' },  // New Moon Jul 14
    { date: 29, type: 'purnama', day: 'Rabu' }   // Full Moon Jul 29
  ],
  7: [ // Agustus
    { date: 12, type: 'gelap', day: 'Rabu' },    // New Moon Aug 12
    { date: 28, type: 'purnama', day: 'Jumat' }  // Full Moon Aug 28
  ],
  8: [ // September
    { date: 11, type: 'gelap', day: 'Jumat' },   // New Moon Sep 11
    { date: 27, type: 'purnama', day: 'Minggu' } // Full Moon Sep 27
  ],
  9: [ // Oktober
    { date: 11, type: 'gelap', day: 'Minggu' },  // New Moon Oct 11
    { date: 27, type: 'purnama', day: 'Selasa' } // Full Moon Oct 27
  ],
  10: [ // November
    { date: 9,  type: 'gelap', day: 'Senin' },   // New Moon Nov 9
    { date: 25, type: 'purnama', day: 'Rabu' }   // Full Moon Nov 25
  ],
  11: [ // Desember
    { date: 9,  type: 'gelap', day: 'Rabu' },    // New Moon Dec 9
    { date: 24, type: 'purnama', day: 'Kamis' }  // Full Moon Dec 24
  ]
};

const importantDates: ImportantDate[] = [
  { name: 'Maghapuja 2569/2026', date: 'Selasa, 3 Maret 2026', icon: 'dharmachakra' },
  { name: 'Waisak Nasional 2569/2026', date: 'Minggu, 31 Mei 2026', icon: 'star' },
  { name: 'Asālhapūjā 2569/2026', date: 'Rabu, 29 Juli 2026', icon: 'book-reader' },
  { name: 'Masuk Vassa 2569/2026', date: 'Rabu, 29 Juli 2026', icon: 'umbrella' },
  { name: 'Masa vassa 2569/2026', date: 'Rabu, 29 Juli 2026 s/d ??? 2026', icon: 'calendar-alt' },
  { name: 'Awal masa Kathina', date: 'Tanggal disesuaikan lokal 2026', icon: 'gift' },
  { name: 'Akhir masa Kathina', date: 'Tanggal disesuaikan lokal 2026', icon: 'check-circle' }
];


  // Helper function to get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = 2026;
    const daysInMonth = getDaysInMonth(selectedMonth, year);
    const firstDay = getFirstDayOfMonth(selectedMonth, year);
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Check if a date is Uposatha
  const isUposatha = (day: number) => {
    return uposathaData[selectedMonth].find(u => u.date === day);
  };

  return (
    <View className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="bg-[#2d2d2d] pt-16 pb-6 px-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => setActiveSection('Dashboard')}
            className="mr-4"
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1">
            Kalender Buddhis 2026
          </Text>
        </View>
        <Text className="text-sm text-neutral-200 text-center">
          Hari Uposatha Bulan Gelap dan Terang
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="px-5 pt-5">
          {/* Month Navigation */}
          <View className="flex-row items-center justify-between mb-5">
            <TouchableOpacity 
              onPress={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
              className="w-10 h-10 items-center justify-center"
            >
              <FontAwesome5 name="chevron-left" size={20} color="#b37712" />
            </TouchableOpacity>
            
            <Text className="text-xl font-extrabold text-neutral-800">
              {months[selectedMonth]} 2026
            </Text>
            
            <TouchableOpacity 
              onPress={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
              className="w-10 h-10 items-center justify-center"
            >
              <FontAwesome5 name="chevron-right" size={20} color="#b37712" />
            </TouchableOpacity>
          </View>

          {/* Calendar Grid */}
          <View className="bg-white rounded-2xl p-4 mb-5">
            {/* Week days header */}
            <View className="flex-row mb-2">
              {weekDays.map((day, index) => (
                <View key={index} className="flex-1 items-center py-2">
                  <Text className="text-xs font-bold text-neutral-600">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => {
                const uposathaDay = day ? isUposatha(day) : null;
                
                return (
                  <View 
                    key={index} 
                    className="w-[14.28%] aspect-square p-1"
                  >
                    {day ? (
                      <View className={`flex-1 items-center justify-center rounded-xl ${
                        uposathaDay 
                          ? uposathaDay.type === 'purnama' 
                            ? 'bg-amber-100 border-2 border-[#b37712]' 
                            : 'bg-neutral-100 border-2 border-neutral-400'
                          : 'bg-transparent'
                      }`}>
                        <Text className={`text-base font-semibold ${
                          uposathaDay 
                            ? uposathaDay.type === 'purnama'
                              ? 'text-[#b37712]'
                              : 'text-neutral-700'
                            : 'text-neutral-800'
                        }`}>
                          {day}
                        </Text>
                        {uposathaDay && (
                          <View className="mt-1">
                            <FontAwesome5 
                              name={uposathaDay.type === 'purnama' ? 'moon' : 'circle'} 
                              size={8} 
                              color={uposathaDay.type === 'purnama' ? '#b37712' : '#525252'} 
                            />
                          </View>
                        )}
                      </View>
                    ) : (
                      <View className="flex-1" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Legend */}
          <View className="flex-row items-center justify-center mb-5">
            <View className="flex-row items-center mr-6">
              <View className="w-4 h-4 rounded bg-amber-100 border-2 border-[#b37712] mr-2" />
              <Text className="text-sm text-neutral-700">Bulan Purnama</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded bg-neutral-100 border-2 border-neutral-400 mr-2" />
              <Text className="text-sm text-neutral-700">Bulan Gelap</Text>
            </View>
          </View>

          {/* Uposatha Days List for Selected Month */}
          <Text className="text-xl font-extrabold text-neutral-800 mb-4">
            Hari Uposatha Bulan Ini
          </Text>

          {uposathaData[selectedMonth].map((uposatha, index) => (
            <View 
              key={index}
              className="bg-white rounded-2xl p-5 mb-4 border-l-4 border-[#b37712]"
            >
              <View className="flex-row items-center">
                <View className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
                  uposatha.type === 'purnama' ? 'bg-amber-100' : 'bg-neutral-200'
                }`}>
                  <FontAwesome5 
                    name={uposatha.type === 'purnama' ? 'moon' : 'circle'} 
                    size={24} 
                    color={uposatha.type === 'purnama' ? '#b37712' : '#525252'} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-neutral-800 mb-1">
                    {uposatha.date} {months[selectedMonth]}, {uposatha.day}
                  </Text>
                  <View className={`px-3 py-1 rounded-full self-start ${
                    uposatha.type === 'purnama' ? 'bg-amber-100' : 'bg-neutral-100'
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      uposatha.type === 'purnama' ? 'text-[#b37712]' : 'text-neutral-700'
                    }`}>
                      {uposatha.type === 'purnama' ? 'Bulan Purnama' : 'Bulan Gelap'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Important Dates Section */}
          <Text className="text-xl font-extrabold text-neutral-800 mb-4 mt-4">
            Hari-hari Penting 2026
          </Text>

          {importantDates.map((item, index) => (
            <View 
              key={index}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-neutral-300"
            >
              <View className="w-12 h-12 rounded-xl bg-amber-100 items-center justify-center mr-4">
                <FontAwesome5 name={item.icon} size={20} color="#b37712" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-800 mb-1">
                  {item.name}
                </Text>
                <Text className="text-xs text-neutral-600">
                  {item.date}
                </Text>
              </View>
            </View>
          ))}

          {/* Info Box */}
          <View className="bg-amber-50 rounded-2xl p-5 mb-5 mt-4 border-l-4 border-[#b37712]">
            <View className="flex-row items-start">
              <View className="mr-3 mt-1">
                <FontAwesome5 name="info-circle" size={20} color="#b37712" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-800 mb-2">
                  Tentang Hari Uposatha
                </Text>
                <Text className="text-sm text-neutral-700 leading-6">
                  Hari Uposatha adalah hari suci dalam kalender Buddhis yang jatuh pada hari bulan purnama dan bulan gelap. Pada hari ini, umat Buddha melakukan praktik spiritual lebih intensif seperti meditasi, mendengarkan Dharma, dan menjaga sila lebih ketat.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BuddhistCalendar;