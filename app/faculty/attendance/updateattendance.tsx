import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Text, View, Button } from '@/components/ThemedComponents';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '@/app/AuthContext';
import { COLORS, SIZES, BORDERRADIUS } from '@/constants';
import { Feather } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Student {
  _id: string;
  name: string;
}

interface Subject {
  _id: string;
  id: string;
  name: string;
  subType: "theory" | "practical" | "tg";
  batch?: string[];
}
interface AttendanceRecord {
  _id: string;
  subject: string;
  date: string;
  session: string;
  records: { student: string; status: 'present' | 'absent' }[];
}

interface User {
  institute: {
    _id: string;
  };
  subjects?: Subject[];
}

export default function UpdateAttendanceScreen() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [availableSessions, setAvailableSessions] = useState<number[]>([1,2,3,4,5,6,7]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);

 const [showDatePicker, setShowDatePicker] = useState(false);
 
   const { user } = useAuth() as { user: User };
 
  
  const fetchAttendanceRecord = async () => {
    if (!selectedSubject || !selectedDate || !selectedSession) {
      Alert.alert('Error', 'Please select subject, date, and session');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v2/update-attendance`, {
        params: {
          _id: selectedSubject,
          batchId: selectedBatch,
          date: selectedDate.toISOString().split('T')[0],
          session: selectedSession,
        },
      });
      const { subject, students, attendanceRecord } = response.data;
      setStudents(students || []);
      setAttendanceRecord(attendanceRecord);
      if (attendanceRecord) {
        setSelectedStudents(new Set(attendanceRecord.records.filter((r: { status: string; }) => r.status === 'present').map((r: { student: any; }) => r.student)));
      } else {
        setSelectedStudents(new Set());
      }
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      Alert.alert('Error', 'Failed to fetch attendance record');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async () => {
    if (!selectedSubject || !selectedSession) {
      Alert.alert('Error', 'Please select a subject and session');
      return;
    }

    const attendanceData = {
      subject: selectedSubject,
      date: selectedDate.toISOString().split('T')[0],
      session: selectedSession,
      institute:user?.institute._id,
      attendanceRecords: students.map(student => ({
        student: student._id,
        status: selectedStudents.has(student._id) ? 'present' : 'absent',
      })),
      batchId: selectedBatch,
    };

    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/v2/attendance`, attendanceData);
      Alert.alert('Success', 'Attendance updated successfully');
      setStudents([]);
      setSelectedSession(null);
      setSelectedSubject('');
      setSelectedBatch(null);

    } catch (error) {
      console.error('Failed to update attendance:', error);
      Alert.alert('Error', 'Failed to update attendance');
    } finally {
      setLoading(false);
    }
  };
const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate) {
      setSelectedDate(currentDate);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text variant="h2" style={styles.title}>Update Attendance</Text>
        <View style={styles.inputContainer}>
          <Feather name="book" size={24} color={COLORS.primary.main} style={styles.inputIcon} />
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(value: string) => setSelectedSubject(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Subject" value="" />
            {user?.subjects?.map((subject: Subject) => (
              <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
            ))}
          </Picker>
        </View>

        {selectedSubject && user?.subjects?.find((s: Subject) => s._id === selectedSubject)?.subType === 'practical' && (
          <View style={styles.inputContainer}>
            <Feather name="users" size={24} color={COLORS.primary.main} style={styles.inputIcon} />
            <Picker
              selectedValue={selectedBatch}
              onValueChange={(value: string | null) => setSelectedBatch(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Batch" value={null} />
              {user?.subjects.find((s: Subject) => s._id === selectedSubject)?.batch?.map((batch: string) => (
                <Picker.Item key={batch} label={`Batch ${batch}`} value={batch} />
              ))}
            </Picker>
          </View>
        )}

       

{showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.inputContainer}>
          <Feather name="clock" size={24} color={COLORS.primary.main} style={styles.inputIcon} />
          <Picker
            selectedValue={selectedSession}
            onValueChange={setSelectedSession}
            style={styles.picker}
          >
            <Picker.Item label="Select Session" value={null} />
            {availableSessions.map((session) => (
              <Picker.Item key={session} label={session.toString()} value={session} />
            ))}
          </Picker>
        </View>

        <Button
          title="Fetch Attendance"
          onPress={fetchAttendanceRecord}
          style={styles.fetchButton}
          disabled={loading}
        />

        {students.length > 0 && (
          <View style={styles.studentList}>
            <Text variant="h3" style={styles.sectionTitle}>Students</Text>
            {students.map(student => (
              <View key={student._id} style={styles.studentItem}>
                <Text>{student.name}</Text>
                <Button
                  title={selectedStudents.has(student._id) ? 'Present' : 'Absent'}
                  onPress={() => {
                    setSelectedStudents(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(student._id)) {
                        newSet.delete(student._id);
                      } else {
                        newSet.add(student._id);
                      }
                      return newSet;
                    });
                  }}
                  variant={selectedStudents.has(student._id) ? 'primary' : 'outlined'}
                  style={styles.attendanceButton}
                />
              </View>
            ))}
          </View>
        )}

        {attendanceRecord && (
          <Button
            title="Update Attendance"
            onPress={updateAttendance}
            style={styles.updateButton}
            disabled={loading}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  formContainer: {
    padding: SIZES.medium,
  },
  title: {
    marginBottom: SIZES.large,
    color: COLORS.primary.main,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    backgroundColor: COLORS.background.paper,
    borderRadius: BORDERRADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.neutral.black,
  },
  inputIcon: {
    padding: SIZES.small,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  dateButton: {
    marginBottom: SIZES.medium,
  },
  fetchButton: {
    marginVertical: SIZES.medium,
  },
  sectionTitle: {
    marginVertical: SIZES.medium,
    color: COLORS.primary.main,
  },
  studentList: {
    marginTop: SIZES.large,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.black,
  },
  attendanceButton: {
    minWidth: 100,
  },
  updateButton: {
    marginTop: SIZES.large,
  },
});

