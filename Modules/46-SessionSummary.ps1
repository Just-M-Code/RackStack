#region ===== SESSION SUMMARY =====
# Function to show session summary
function Show-SessionSummary {
    Clear-Host
    Write-CenteredOutput "Session Summary" -color "Info"

    # Calculate runtime
    $runtime = (Get-Date) - $script:ScriptStartTime
    $runtimeStr = "{0:D2}:{1:D2}:{2:D2}" -f [int][math]::Floor($runtime.TotalHours), $runtime.Minutes, $runtime.Seconds

    Write-OutputColor "Session Runtime: $runtimeStr" -color "Info"
    Write-OutputColor "" -color "Info"

    if ($script:SessionChanges.Count -eq 0) {
        Write-OutputColor "No changes were made during this session." -color "Info"
    }
    else {
        Write-OutputColor "Changes made during this session:" -color "Info"
        Write-OutputColor ("-" * 60) -color "Info"

        # Group by category for easier scanning
        $categories = @($script:SessionChanges | Group-Object -Property Category)
        foreach ($cat in $categories) {
            Write-OutputColor "" -color "Info"
            Write-OutputColor "  $($cat.Name) ($($cat.Count)):" -color "Info"
            foreach ($change in $cat.Group) {
                Write-OutputColor "    [$($change.Timestamp)] $($change.Description)" -color "Success"
            }
        }

        Write-OutputColor "" -color "Info"
        Write-OutputColor ("-" * 60) -color "Info"
        Write-OutputColor "Total: $($script:SessionChanges.Count) change(s) across $($categories.Count) category(ies)" -color "Info"
    }

    # Show persistent log path
    $logFile = "$script:AppConfigDir\session-log.txt"
    if (Test-Path $logFile) {
        Write-OutputColor "" -color "Info"
        Write-OutputColor "Session log saved to: $logFile" -color "Info"
    }

    # Offer to export summary to Desktop
    if ($script:SessionChanges.Count -gt 0) {
        Write-OutputColor "" -color "Info"
        if (Confirm-UserAction -Message "Export session summary to Desktop?") {
            $summaryPath = "$env:USERPROFILE\Desktop\$($env:COMPUTERNAME)_Session_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
            try {
                $summaryLines = @("Session Summary - $(Get-Date)", "Runtime: $runtimeStr", "")
                foreach ($change in $script:SessionChanges) {
                    $summaryLines += "[$($change.Timestamp)] [$($change.Category)] $($change.Description)"
                }
                $summaryLines | Out-File -FilePath $summaryPath -Encoding UTF8 -Force
                Write-OutputColor "  Summary exported to: $summaryPath" -color "Success"
            }
            catch {
                Write-OutputColor "  Failed to export: $_" -color "Error"
            }
        }
    }

    Write-OutputColor "" -color "Info"

    # Check both our flag AND Windows pending reboot
    $windowsRebootPending = Test-RebootPending
    if ($global:RebootNeeded -or $windowsRebootPending) {
        if ($windowsRebootPending -and -not $global:RebootNeeded) {
            Write-OutputColor "[!] Windows has a pending reboot (from previous changes)." -color "Warning"
        }
        else {
            Write-OutputColor "[!] A reboot is required to apply changes." -color "Warning"
        }
    }
}
#endregion