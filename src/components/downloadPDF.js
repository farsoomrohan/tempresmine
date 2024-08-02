// ResumePDF.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 700,
    paddingBottom: "4px",
    paddingTop: "4px",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#2C4B84",
  },
  subHeading: {
    fontSize: 16,
    paddingBottom: "8px",
    paddingTop: "4px",
    fontWeight: 600,
    color: "#2C4B84",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#6c727f",
    textAlign: "justify",
    lineHeight: 1.5, // Added line height for spacing between lines
  },
  label: {
    fontSize: 12,
    paddingBottom: "4px",
    paddingTop: "4px",
    fontWeight: 400,
    color: "#000929",
    textAlign: "justify",
    lineHeight: 1.5, // Added line height for spacing between lines
  },
});

const ResumePDF = ({ resumeData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Resume Summary</Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Name:</Text> {resumeData?.name}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Email:</Text> {resumeData?.email}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Phone:</Text> {resumeData?.phone}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Skills</Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Primary Skills:</Text>{" "}
          {resumeData?.skills?.primary?.skills?.join(", ")}
        </Text>
        <Text style={styles.text}>
          Score: {resumeData?.skills?.primary?.score}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Optional Skills:</Text>{" "}
          {resumeData?.skills?.optional?.skills?.join(", ")}
        </Text>
        <Text style={styles.text}>
          Score: {resumeData?.skills?.optional?.score}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Work Summary</Text>
        {resumeData?.workSummary?.map((work, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.label}>Job Title:</Text> {work?.job_title}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Organization:</Text>{" "}
              {work?.organization}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Summary:</Text>{" "}
              {work?.summary_of_this_project}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Technology Stack:</Text>{" "}
              {work?.technology_stack?.join(", ")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Education</Text>
        {resumeData?.education?.map((education, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.label}>Degree:</Text>{" "}
              {education?.degree || "NA"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>University:</Text>{" "}
              {education?.institution || "NA"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Year:</Text> {education?.year || "NA"}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeading}>Certifications</Text>
        <Text style={styles.text}>
          {resumeData?.certifications?.join(", ")}
        </Text>
      </View>
    </Page>
  </Document>
);

export default ResumePDF;
