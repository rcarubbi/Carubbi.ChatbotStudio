using System;
using System.Linq;

namespace Carubbi.BotEditor.FormsIntegration
{
    public static class GrammarUtilities
    {
        public static string FirstWord(this string phrase)
        {
            return phrase.Split(' ')[0];
        }

        public static DateTime? ParseDate(string dateExpression)
        {
            if (DateTime.TryParse(dateExpression, out var date))
            {
                if (date.Year == 1)
                    date.AddYears(DateTime.Today.Year - 1);
                return date;
            }
            else
            {
                if (new string[] { "amanha", "amanhã" }.Any(a => a == dateExpression.ToLower()))
                {
                    return DateTime.Today.AddDays(1);
                }
                else if (new string[] { "depois de amanha", "depois de amanhã" }.Any(a => a == dateExpression.ToLower()))
                {
                    return DateTime.Today.AddDays(2);
                }
                else if (dateExpression.ToLower().Contains("segunda"))
                {
                    return GetNextWeekday(DateTime.Today, DayOfWeek.Monday);
                }
                else if (dateExpression.ToLower().Contains("terça"))
                {
                    return GetNextWeekday(DateTime.Today, DayOfWeek.Tuesday);
                }
                else if (dateExpression.ToLower().Contains("quarta")) { return GetNextWeekday(DateTime.Today, DayOfWeek.Wednesday); }
                else if (dateExpression.ToLower().Contains("quinta")) { return GetNextWeekday(DateTime.Today, DayOfWeek.Thursday); }
                else if (dateExpression.ToLower().Contains("sexta")) { return GetNextWeekday(DateTime.Today, DayOfWeek.Friday); }
                else
                {
                    return null;
                }

            }
        }

        private static DateTime GetNextWeekday(DateTime start, DayOfWeek day)
        {
            int daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
            return start.AddDays(daysToAdd);
        }

        public static DateTime? ParseTime(string timeExpression)
        {
            if (DateTime.TryParse(timeExpression, out var date))
            {
                return date;
            }
            else
            {

                if (new string[] { "meio dia", "meio-dia" }.Any(a => a == timeExpression.ToLower()))
                {
                    return new DateTime(1, 1, 1, 12, 0, 0);
                }
                else if (timeExpression.Contains("18"))
                {
                    return new DateTime(1, 1, 1, 18, 0, 0);
                }
                else if (timeExpression.Contains("17"))
                {
                    return new DateTime(1, 1, 1, 17, 0, 0);
                }
                else if (timeExpression.Contains("16"))
                {
                    return new DateTime(1, 1, 1, 16, 0, 0);
                }
                else if (timeExpression.Contains("15"))
                {
                    return new DateTime(1, 1, 1, 15, 0, 0);
                }
                else if (timeExpression.Contains("14"))
                {
                    return new DateTime(1, 1, 1, 14, 0, 0);
                }
                else if (timeExpression.Contains("13"))
                {
                    return new DateTime(1, 1, 1, 13, 0, 0);
                }
                else if (timeExpression.Contains("12"))
                {
                    return new DateTime(1, 1, 1, 12, 0, 0);
                }
                else if (timeExpression.Contains("11"))
                {
                    return new DateTime(1, 1, 1, 11, 0, 0);
                }
                else if (timeExpression.Contains("10"))
                {
                    return new DateTime(1, 1, 1, 10, 0, 0);
                }
                else if (timeExpression.Contains("9"))
                {
                    return new DateTime(1, 1, 1, 9, 0, 0);
                }
                else if (timeExpression.Contains("6"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 18, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 6, 0, 0);
                }
                else if (timeExpression.Contains("5"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 17, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 5, 0, 0);
                }
                else if (timeExpression.Contains("4"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 16, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 4, 0, 0);
                }
                else if (timeExpression.Contains("3"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 15, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 3, 0, 0);
                }
                else if (timeExpression.Contains("2"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 14, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 2, 0, 0);
                }
                else if (timeExpression.Contains("1"))
                {
                    if (timeExpression.Contains("tarde"))
                        return new DateTime(1, 1, 1, 13, 0, 0);
                    else
                        return new DateTime(1, 1, 1, 1, 0, 0);
                }
                else if (new string[] { "manhã", "manha" }.Any(a => a == timeExpression.ToLower()))
                {
                    return new DateTime(1, 1, 1, 9, 0, 0);
                }
                else if (new string[] { "fim da tarde", "fim de tarde" }.Any(a => a == timeExpression.ToLower()))
                {
                    return new DateTime(1, 1, 1, 17, 0, 0);
                }
                else if (timeExpression.Contains("tarde"))
                {
                    return new DateTime(1, 1, 1, 13, 0, 0);
                }
                else
                    return null;

            }
        }
    }
}