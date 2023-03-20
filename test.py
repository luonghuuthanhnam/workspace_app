import pandas as pd
import matplotlib.pyplot as plt

def visualize_excel_piechart(filename):
    # Load the Excel file into a pandas DataFrame
    df = pd.read_excel(filename)

    # Extract the values from the "tongtien" column
    values = df['tongtien'].values

    # Calculate the percentages for each value
    total = sum(values)
    percentages = [(v/total)*100 for v in values]

    # Create the pie chart
    labels = df.index.tolist()
    plt.pie(percentages, labels=labels, autopct='%1.1f%%')
    plt.title('Tongtien Distribution')

    # Show the chart
    plt.show()
