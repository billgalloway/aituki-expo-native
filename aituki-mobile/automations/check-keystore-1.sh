#!/bin/bash
# Check keystore #1: @billgalloway__aituki-native_OLD_4.jks
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_4.jks" | grep SHA1

