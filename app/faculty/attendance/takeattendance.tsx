import React, { useState, useEffect } from 'react';
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

interface User {
  institute: {
    _id: string;
  };
  subjects?: Subject[];
}

export default function TakeAttendanceScreen() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { user } = useAuth() as { user: User };

  useEffect(() => {
    if (selectedSubject && selectedDate) {
      fetchAvailableSessions();
    }
  }, [selectedSubject, selectedBatch, selectedDate]);

  const fetchAvailableSessions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/utils/available-sessions`, {
        params: {
          subjectId: selectedSubject,
          batchId: selectedBatch,
          date: selectedDate.toISOString().split('T')[0],
        },
      });
      setAvailableSessions(response.data.availableSessions);
    } catch (error) {
      console.error('Error fetching available sessions:', error);
      Alert.alert('Error', 'Failed to fetch available sessions');
    }
  };
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios');
    if (currentDate) {
      setSelectedDate(currentDate);
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v2/utils/attendance-data`, {
        params: {
          _id: selectedSubject,
          batchId: selectedBatch,
        },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch students');
    }
  };

  const handleTakeAttendance = () => {
    if (selectedSubject && selectedDate && selectedSessions.length > 0) {

      fetchStudents()

    } else {
      Alert.alert('Error', 'Please select subject, date, and at least one session');
    }
  };

  const submitAttendance = async () => {
    if (!selectedSubject || selectedSessions.length === 0) {
      Alert.alert('Error', 'Please select a subject and at least one session');
      return;
    }

    const attendanceData = {
      subject: selectedSubject,
      date: selectedDate.toISOString().split('T')[0],
      session: selectedSessions,
      institute: user?.institute._id,
      attendanceRecords: students.map(student => ({
        student: student._id,
        status: selectedStudents.has(student._id) ? 'present' : 'absent',
      })),
      batchId: selectedBatch,
    };

    setLoading(true);
    try {
      console.log(attendanceData);

      await axios.put(`${API_URL}/api/v2/attendance`, attendanceData);
      Alert.alert('Success', 'Attendance submitted successfully');
      // Reset form
      setSelectedSubject("");
      setSelectedBatch(null);
      setSelectedSessions([]);
      setSelectedStudents(new Set());
    } catch (error) {
      console.error('Failed to submit attendance:', error);
      Alert.alert('Error', 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text variant="h2" style={styles.title}>Take Attendance</Text>


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

        <Text variant="h3" style={styles.sectionTitle}>Select Sessions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sessionScrollView}>
          {availableSessions.map(session => (
            <Button
              key={session}
              title={session}
              onPress={() => {
                setSelectedSessions(prev =>
                  prev.includes(session)
                    ? prev.filter(s => s !== session)
                    : [...prev, session]
                );
              }}
              variant={selectedSessions.includes(session) ? 'primary' : 'outlined'}
              style={styles.sessionButton}
            />
          ))}
        </ScrollView>

        <Button
          title="Take Attendance"
          onPress={handleTakeAttendance}
          style={styles.takeAttendanceButton}
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

        {students?.length > 0 && (<Button
          title="Submit Attendance"
          onPress={submitAttendance}
          style={styles.submitButton}
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
  sectionTitle: {
    marginVertical: SIZES.medium,
    color: COLORS.primary.main,
  },
  sessionScrollView: {
    marginBottom: SIZES.medium,
  },
  sessionButton: {
    marginRight: SIZES.small,
    minWidth: 100,
  },
  takeAttendanceButton: {
    marginVertical: SIZES.large,
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
  submitButton: {
    marginTop: SIZES.large,
  },
});

